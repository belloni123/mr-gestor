import { AuditAction } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { auditLog, isMfaPendingExpired, setAuthenticatedSession } from "@/lib/auth";
import { encryptSecret } from "@/lib/crypto";
import { getPrisma } from "@/lib/prisma";
import { getClientIp, getUserAgent } from "@/lib/request";
import { getSession } from "@/lib/session";
import { generateTotpSecret, getTotpEnrollmentPayload, verifyTotp } from "@/lib/totp";

const verifySchema = z.object({
  token: z.string().min(6).max(10),
});

export async function GET() {
  const session = await getSession();

  if (!session.pendingMfa || session.pendingMfa.purpose !== "setup" || isMfaPendingExpired(session.pendingMfa.issuedAt)) {
    session.destroy();
    return NextResponse.json({ error: "Sessao de 2FA expirada." }, { status: 401 });
  }

  const user = await getPrisma().user.findUnique({
    where: { id: session.pendingMfa.userId },
    select: { email: true, mfaEnabled: true },
  });

  if (!user || user.mfaEnabled) {
    session.destroy();
    return NextResponse.json({ error: "Setup de 2FA indisponivel." }, { status: 409 });
  }

  if (!session.pendingMfa.secret) {
    session.pendingMfa.secret = generateTotpSecret();
    await session.save();
  }

  return NextResponse.json(await getTotpEnrollmentPayload(user.email, session.pendingMfa.secret));
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);
  const session = await getSession();
  const parsed = verifySchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success || !session.pendingMfa || session.pendingMfa.purpose !== "setup" || !session.pendingMfa.secret) {
    return NextResponse.json({ error: "Codigo invalido." }, { status: 400 });
  }

  if (isMfaPendingExpired(session.pendingMfa.issuedAt)) {
    session.destroy();
    return NextResponse.json({ error: "Sessao de 2FA expirada." }, { status: 401 });
  }

  if (!verifyTotp(parsed.data.token, session.pendingMfa.secret)) {
    await auditLog({
      userId: session.pendingMfa.userId,
      action: AuditAction.LOGIN_FAILURE,
      message: "Codigo TOTP invalido no setup.",
      ip,
      userAgent,
    });
    return NextResponse.json({ error: "Codigo invalido." }, { status: 401 });
  }

  await getPrisma().user.update({
    where: { id: session.pendingMfa.userId },
    data: {
      mfaEnabled: true,
      mfaSecretEncrypted: encryptSecret(session.pendingMfa.secret),
    },
  });

  await auditLog({
    userId: session.pendingMfa.userId,
    action: AuditAction.MFA_SETUP,
    message: "2FA TOTP ativado.",
    ip,
    userAgent,
  });

  const user = await setAuthenticatedSession(session.pendingMfa.userId);

  return NextResponse.json({ ok: true, user });
}
