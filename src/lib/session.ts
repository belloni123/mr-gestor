import "server-only";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

import type { AuthSessionUser } from "@/lib/auth-types";

export type PendingMfa = {
  userId: string;
  purpose: "setup" | "verify";
  secret?: string;
  issuedAt: number;
};

export type SessionData = {
  user?: AuthSessionUser;
  pendingMfa?: PendingMfa;
};

export function getSessionOptions() {
  const password = process.env.SESSION_SECRET;

  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters");
  }

  return {
    cookieName: "mr_gestor_session",
    password,
    ttl: 60 * 60 * 8,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), getSessionOptions());
}

export async function clearSession() {
  const session = await getSession();
  session.destroy();
}
