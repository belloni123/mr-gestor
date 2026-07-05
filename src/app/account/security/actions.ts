"use server";

import { AuditAction } from "@prisma/client";

import { auditLog, requireSessionUser, setAuthenticatedSession } from "@/lib/auth";
import { hashPassword, validatePasswordPolicy, verifyPassword } from "@/lib/password";
import { getPrisma } from "@/lib/prisma";

export type PasswordState = {
  ok: boolean;
  message: string;
};

export async function changeOwnPasswordAction(_: PasswordState, formData: FormData): Promise<PasswordState> {
  const sessionUser = await requireSessionUser();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword !== confirmPassword) {
    return { ok: false, message: "A confirmação não confere." };
  }

  const policyError = validatePasswordPolicy(newPassword, [sessionUser.email, sessionUser.name]);

  if (policyError) {
    return { ok: false, message: policyError };
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    return { ok: false, message: "Senha atual inválida." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await hashPassword(newPassword),
      mustChangePassword: false,
      passwordVersion: {
        increment: 1,
      },
    },
  });

  await auditLog({
    userId: user.id,
    action: AuditAction.PASSWORD_CHANGED,
    message: "Usuário alterou a própria senha.",
  });

  await setAuthenticatedSession(user.id);

  return { ok: true, message: "Senha alterada com sucesso." };
}
