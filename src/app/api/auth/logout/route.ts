import { AuditAction } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

import { auditLog } from "@/lib/auth";
import { getClientIp, getUserAgent } from "@/lib/request";
import { getSession } from "@/lib/session";

function safeNextPath(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next") ?? "/login";

  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/login";
  }

  return next;
}

async function destroySession(request: NextRequest, message = "Logout realizado.") {
  const session = await getSession();
  const userId = session.user?.id;

  if (userId) {
    await auditLog({
      userId,
      action: AuditAction.LOGOUT,
      message,
      ip: getClientIp(request),
      userAgent: getUserAgent(request),
    });
  }

  session.destroy();
}

export async function GET(request: NextRequest) {
  await destroySession(request, "Sessão encerrada automaticamente.");
  return NextResponse.redirect(new URL(safeNextPath(request), request.url));
}

export async function POST(request: NextRequest) {
  await destroySession(request);
  return NextResponse.json({ ok: true });
}
