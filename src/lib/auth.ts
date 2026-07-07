import "server-only";

import { AuditAction, type User } from "@prisma/client";
import { redirect } from "next/navigation";

import type { AuthSessionUser } from "@/lib/auth-types";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const MFA_PENDING_TTL_MS = 10 * 60 * 1000;
const LOGIN_FAILURE_WINDOW_MS = 10 * 60 * 1000;
const IP_FAILURE_LIMIT = 20;
const USER_FAILURE_LIMIT = 5;
const LOCKOUT_MINUTES = 15;

type UserWithCompanies = User & {
  companies: Array<{
    canEdit: boolean;
    company: {
      id: string;
      slug: string;
      name: string;
    };
  }>;
};

export function getLockoutUntil() {
  return new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
}

export function isMfaPendingExpired(issuedAt: number) {
  return Date.now() - issuedAt > MFA_PENDING_TTL_MS;
}

export async function isIpRateLimited(ip: string) {
  const prisma = getPrisma();
  const since = new Date(Date.now() - LOGIN_FAILURE_WINDOW_MS);
  const count = await prisma.loginAttempt.count({
    where: {
      ip,
      success: false,
      createdAt: {
        gte: since,
      },
    },
  });

  return count >= IP_FAILURE_LIMIT;
}

export function toSessionUser(user: UserWithCompanies): AuthSessionUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
    passwordVersion: user.passwordVersion,
    companies: user.companies
      .filter((item) => item.company)
      .map((item) => ({
        id: item.company.id,
        slug: item.company.slug,
        name: item.company.name,
        canEdit: item.canEdit,
      })),
  };
}

export async function getUserForSession(userId: string) {
  return getPrisma().user.findUnique({
    where: { id: userId },
    include: {
      companies: {
        include: {
          company: true,
        },
      },
    },
  });
}

export async function setAuthenticatedSession(userId: string) {
  const session = await getSession();
  const user = await getUserForSession(userId);

  if (!user || !user.isActive) {
    session.destroy();
    return null;
  }

  session.pendingMfa = undefined;
  session.user = toSessionUser(user);
  await session.save();

  return session.user;
}

export async function requireSessionUser() {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  const freshUser = await getPrisma().user.findUnique({
    where: { id: session.user.id },
    select: {
      isActive: true,
      passwordVersion: true,
    },
  });

  if (!freshUser?.isActive || freshUser.passwordVersion !== session.user.passwordVersion) {
    session.destroy();
    redirect("/login");
  }

  return session.user;
}

export async function requireSuperAdmin() {
  const user = await requireSessionUser();

  if (user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  return user;
}

export function getAllowedCompanySlugs(user: AuthSessionUser) {
  if (user.role === "SUPER_ADMIN") return "all" as const;
  return user.companies.map((company) => company.slug);
}

export async function recordLoginAttempt(input: {
  email: string;
  ip: string;
  userAgent?: string;
  success: boolean;
  reason: string;
}) {
  await getPrisma().loginAttempt.create({
    data: input,
  });
}

export async function auditLog(input: {
  userId?: string;
  action: AuditAction;
  message: string;
  metadata?: Record<string, string | number | boolean | null>;
  ip?: string;
  userAgent?: string;
}) {
  await getPrisma().auditLog.create({
    data: input,
  });
}

export async function registerFailedPassword(user: User) {
  const failedLoginCount = user.failedLoginCount + 1;

  await getPrisma().user.update({
    where: { id: user.id },
    data: {
      failedLoginCount,
      lockedUntil: failedLoginCount >= USER_FAILURE_LIMIT ? getLockoutUntil() : null,
    },
  });
}

export async function resetLoginState(userId: string) {
  await getPrisma().user.update({
    where: { id: userId },
    data: {
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  });
}
