"use server";

import { AuditAction, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auditLog, requireSuperAdmin } from "@/lib/auth";
import { hashPassword, validatePasswordPolicy } from "@/lib/password";
import { getPrisma } from "@/lib/prisma";

export type AdminActionState = {
  ok: boolean;
  message: string;
};

const initialAdminState: AdminActionState = {
  ok: false,
  message: "",
};

function roleFromValue(value: FormDataEntryValue | null) {
  return value === "SUPER_ADMIN" ? UserRole.SUPER_ADMIN : UserRole.EDITOR;
}

function selectedCompanySlugs(formData: FormData) {
  return formData.getAll("companySlugs").map(String).filter(Boolean);
}

export async function createUserAction(previousState: AdminActionState = initialAdminState, formData: FormData) {
  void previousState;
  const admin = await requireSuperAdmin();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = roleFromValue(formData.get("role"));
  const companySlugs = selectedCompanySlugs(formData);

  if (!email || !name || !password) {
    return { ok: false, message: "Preencha nome, e-mail e senha inicial." };
  }

  if (role === UserRole.EDITOR && companySlugs.length === 0) {
    return { ok: false, message: "Editor precisa estar vinculado a pelo menos uma empresa." };
  }

  const policyError = validatePasswordPolicy(password, [email, name]);

  if (policyError) {
    return { ok: false, message: policyError };
  }

  const prisma = getPrisma();
  const companies = await prisma.company.findMany({
    where: {
      slug: {
        in: companySlugs,
      },
    },
  });

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        passwordHash: await hashPassword(password),
        mustChangePassword: true,
        companies: {
          create: companies.map((company) => ({
            companyId: company.id,
            canEdit: true,
          })),
        },
      },
    });

    await auditLog({
      userId: admin.id,
      action: AuditAction.USER_CREATED,
      message: `Usuario criado: ${email}`,
      metadata: {
        createdUserId: user.id,
        role,
      },
    });
  } catch {
    return { ok: false, message: "Nao foi possivel criar usuario. Confira se o e-mail ja existe." };
  }

  revalidatePath("/admin/users");
  return { ok: true, message: "Usuario criado com senha inicial e 2FA obrigatorio." };
}

export async function resetUserPasswordAction(previousState: AdminActionState = initialAdminState, formData: FormData) {
  void previousState;
  const admin = await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  const password = String(formData.get("password") ?? "");

  const target = await getPrisma().user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  });

  if (!target) {
    return { ok: false, message: "Usuario nao encontrado." };
  }

  const policyError = validatePasswordPolicy(password, [target.email, target.name]);

  if (policyError) {
    return { ok: false, message: policyError };
  }

  await getPrisma().user.update({
    where: { id: userId },
    data: {
      passwordHash: await hashPassword(password),
      mustChangePassword: true,
      passwordVersion: {
        increment: 1,
      },
    },
  });

  await auditLog({
    userId: admin.id,
    action: AuditAction.PASSWORD_RESET,
    message: `Senha resetada para ${target.email}`,
    metadata: {
      targetUserId: target.id,
    },
  });

  revalidatePath("/admin/users");
  return { ok: true, message: "Senha resetada. O usuario devera troca-la no proximo acesso." };
}

export async function updateUserCompaniesAction(previousState: AdminActionState = initialAdminState, formData: FormData) {
  void previousState;
  const admin = await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  const companySlugs = selectedCompanySlugs(formData);
  const prisma = getPrisma();
  const target = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });

  if (!target) {
    return { ok: false, message: "Usuario nao encontrado." };
  }

  if (target.role === UserRole.EDITOR && companySlugs.length === 0) {
    return { ok: false, message: "Editor precisa ter pelo menos uma empresa vinculada." };
  }

  const companies = await prisma.company.findMany({
    where: {
      slug: {
        in: companySlugs,
      },
    },
  });

  await prisma.$transaction([
    prisma.userCompany.deleteMany({
      where: { userId },
    }),
    prisma.userCompany.createMany({
      data: companies.map((company) => ({
        userId,
        companyId: company.id,
        canEdit: true,
      })),
      skipDuplicates: true,
    }),
  ]);

  await auditLog({
    userId: admin.id,
    action: AuditAction.USER_UPDATED,
    message: `Empresas atualizadas para ${target.email}`,
    metadata: {
      targetUserId: target.id,
      companySlugs: companySlugs.join(","),
    },
  });

  revalidatePath("/admin/users");
  return { ok: true, message: "Empresas permitidas atualizadas." };
}

export async function toggleUserActiveAction(formData: FormData) {
  const admin = await requireSuperAdmin();
  const userId = String(formData.get("userId") ?? "");
  const nextActive = String(formData.get("nextActive")) === "true";
  const user = await getPrisma().user.update({
    where: { id: userId },
    data: {
      isActive: nextActive,
    },
  });

  await auditLog({
    userId: admin.id,
    action: AuditAction.USER_UPDATED,
    message: `${nextActive ? "Usuario ativado" : "Usuario desativado"}: ${user.email}`,
    metadata: {
      targetUserId: user.id,
    },
  });

  revalidatePath("/admin/users");
}
