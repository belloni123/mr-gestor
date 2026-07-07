import "server-only";

import type { NextRequest } from "next/server";

export function getPublicBaseUrl(request?: NextRequest) {
  const configuredUrl = process.env.APP_URL;

  if (configuredUrl) {
    return configuredUrl.replace(/\/+$/, "");
  }

  const forwardedHost = request?.headers.get("x-forwarded-host");
  const host = forwardedHost ?? request?.headers.get("host");

  if (host) {
    const forwardedProto = request?.headers.get("x-forwarded-proto")?.split(",")[0] ?? "https";
    return `${forwardedProto}://${host}`;
  }

  return request?.nextUrl.origin ?? "http://localhost:3000";
}

export function getPublicUrl(path: string, request?: NextRequest) {
  return new URL(path, getPublicBaseUrl(request));
}
