import { AuditAction } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { auditLog, isMfaPendingExpired, setAuthenticatedSession } from "@/lib/auth";
import { decryptSecret } from "@/lib/crypto";
import { getPrisma } from "@/lib/prisma";
import { getClientIp, getUserAgent } from "@/lib/request";
import { getSession } from "@/lib/session";
import { verifyTotp } from "@/lib/totp";

const verifySchema = z.object({
  token: z.string().min(6).max(10),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);
  const session = await getSession();
  const parsed = verifySchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success || !session.pendingMfa || session.pendingMfa.purpose !== "verify") {
    return NextResponse.json({ error: "Codigo invalido." }, { status: 400 });
  }

  if (isMfaPendingExpired(session.pendingMfa.issuedAt)) {
    session.destroy();
    return NextResponse.json({ error: "Sessao de 2FA expirada." }, { status: 401 });
  }

  const user = await getPrisma().user.findUnique({
    where: { id: session.pendingMfa.userId },
    select: {
      id: true,
      mfaSecretEncrypted: true,
      isActive: true,
    },
  });

  if (!user?.isActive || !user.mfaSecretEncrypted) {
    session.destroy();
    return NextResponse.json({ error: "Codigo invalido." }, { status: 401 });
  }

  if (!verifyTotp(parsed.data.token, decryptSecret(user.mfaSecretEncrypted))) {
    await auditLog({
      userId: user.id,
      action: AuditAction.LOGIN_FAILURE,
      message: "Codigo TOTP invalido.",
      ip,
      userAgent,
    });
    return NextResponse.json({ error: "Codigo invalido." }, { status: 401 });
  }

  await auditLog({
    userId: user.id,
    action: AuditAction.MFA_SUCCESS,
    message: "2FA TOTP validado.",
    ip,
    userAgent,
  });

  const sessionUser = await setAuthenticatedSession(user.id);

  return NextResponse.json({ ok: true, user: sessionUser });
}
