import type { NextRequest } from "next/server";

export function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export function getUserAgent(request: NextRequest) {
  return request.headers.get("user-agent") ?? undefined;
}
