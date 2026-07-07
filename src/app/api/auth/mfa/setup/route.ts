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

const MFA_ATTEMPT_LIMIT = 5;

export async function GET() {
  const session = await getSession();

  if (!session.pendingMfa || session.pendingMfa.purpose !== "setup" || isMfaPendingExpired(session.pendingMfa.issuedAt)) {
    session.destroy();
    return NextResponse.json({ error: "Sessão de 2FA expirada." }, { status: 401 });
  }

  const user = await getPrisma().user.findUnique({
    where: { id: session.pendingMfa.userId },
    select: { email: true, mfaEnabled: true },
  });

  if (!user || user.mfaEnabled) {
    session.destroy();
    return NextResponse.json({ error: "Setup de 2FA indisponível." }, { status: 409 });
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
    return NextResponse.json({ error: "Código inválido." }, { status: 400 });
  }

  if (isMfaPendingExpired(session.pendingMfa.issuedAt)) {
    session.destroy();
    return NextResponse.json({ error: "Sessão de 2FA expirada." }, { status: 401 });
  }

  if (!verifyTotp(parsed.data.token, session.pendingMfa.secret)) {
    session.pendingMfa.attempts = (session.pendingMfa.attempts ?? 0) + 1;
    await auditLog({
      userId: session.pendingMfa.userId,
      action: AuditAction.LOGIN_FAILURE,
      message: "Código TOTP inválido no setup.",
      ip,
      userAgent,
    });

    if (session.pendingMfa.attempts >= MFA_ATTEMPT_LIMIT) {
      session.destroy();
      return NextResponse.json({ error: "Muitas tentativas inválidas. Faça login novamente." }, { status: 429 });
    }

    await session.save();
    return NextResponse.json({ error: "Código inválido." }, { status: 401 });
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
