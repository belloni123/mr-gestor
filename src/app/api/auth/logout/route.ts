import { AuditAction } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";

import { auditLog } from "@/lib/auth";
import { getClientIp, getUserAgent } from "@/lib/request";
import { getSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  const session = await getSession();
  const userId = session.user?.id;

  if (userId) {
    await auditLog({
      userId,
      action: AuditAction.LOGOUT,
      message: "Logout realizado.",
      ip: getClientIp(request),
      userAgent: getUserAgent(request),
    });
  }

  session.destroy();

  return NextResponse.json({ ok: true });
}
