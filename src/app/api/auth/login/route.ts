import { AuditAction } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import {
  auditLog,
  isIpRateLimited,
  recordLoginAttempt,
  registerFailedPassword,
  resetLoginState,
} from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { getPrisma } from "@/lib/prisma";
import { getClientIp, getUserAgent } from "@/lib/request";
import { getSession } from "@/lib/session";

const loginSchema = z.object({
  email: z.string().email().transform((value) => value.toLowerCase().trim()),
  password: z.string().min(1),
});

const GENERIC_LOGIN_ERROR = "Credenciais inválidas ou conta temporariamente indisponível.";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request);
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: GENERIC_LOGIN_ERROR }, { status: 400 });
  }

  const { email, password } = parsed.data;

  if (await isIpRateLimited(ip)) {
    await recordLoginAttempt({ email, ip, userAgent, success: false, reason: "ip_rate_limited" });
    return NextResponse.json({ error: GENERIC_LOGIN_ERROR }, { status: 429 });
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      companies: {
        include: {
          company: true,
        },
      },
    },
  });

  if (!user || !user.isActive) {
    await recordLoginAttempt({ email, ip, userAgent, success: false, reason: "unknown_or_inactive_user" });
    return NextResponse.json({ error: GENERIC_LOGIN_ERROR }, { status: 401 });
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    await recordLoginAttempt({ email, ip, userAgent, success: false, reason: "user_locked" });
    await auditLog({
      userId: user.id,
      action: AuditAction.LOGIN_FAILURE,
      message: "Login bloqueado por lockout temporário.",
      ip,
      userAgent,
    });
    return NextResponse.json({ error: GENERIC_LOGIN_ERROR }, { status: 423 });
  }

  const passwordOk = await verifyPassword(password, user.passwordHash);

  if (!passwordOk) {
    await registerFailedPassword(user);
    await recordLoginAttempt({ email, ip, userAgent, success: false, reason: "bad_password" });
    await auditLog({
      userId: user.id,
      action: AuditAction.LOGIN_FAILURE,
      message: "Senha inválida.",
      ip,
      userAgent,
    });
    return NextResponse.json({ error: GENERIC_LOGIN_ERROR }, { status: 401 });
  }

  await resetLoginState(user.id);
  await recordLoginAttempt({ email, ip, userAgent, success: true, reason: "password_ok" });

  const session = await getSession();
  session.user = undefined;
  session.pendingMfa = {
    userId: user.id,
    purpose: user.mfaEnabled ? "verify" : "setup",
    issuedAt: Date.now(),
  };
  await session.save();

  return NextResponse.json({
    ok: true,
    mfaRequired: true,
    setupRequired: !user.mfaEnabled,
  });
}
