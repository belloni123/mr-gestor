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

function getPublicOrigin(request: NextRequest) {
  const configuredUrl = process.env.APP_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request.headers.get("host");

  if (host) {
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0] ?? "https";
    return `${forwardedProto}://${host}`;
  }

  return request.nextUrl.origin;
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
  return NextResponse.redirect(new URL(safeNextPath(request), getPublicOrigin(request)));
}

export async function POST(request: NextRequest) {
  await destroySession(request);
  return NextResponse.json({ ok: true });
}
