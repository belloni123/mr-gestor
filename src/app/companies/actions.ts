"use server";

import crypto from "node:crypto";

import { AuditAction, IntegrationEnvironment, IntegrationProvider } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { auditLog, requireSuperAdmin } from "@/lib/auth";
import { encryptSecret } from "@/lib/crypto";
import { getPrisma } from "@/lib/prisma";

export type CompanyActionState = {
  ok: boolean;
  message: string;
  revealedToken?: string;
};

const initialCompanyState: CompanyActionState = {
  ok: false,
  message: "",
};

function cleanText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function normalizeCode(value: string) {
  return value
    .trim()
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function lastFour(value: string) {
  return value.slice(-4);
}

function generateCompanyToken() {
  return `mr_${crypto.randomBytes(24).toString("base64url")}`;
}

function parseProvider(value: FormDataEntryValue | null) {
  return value === IntegrationProvider.CONTA_AZUL ? IntegrationProvider.CONTA_AZUL : IntegrationProvider.ASAAS;
}

function parseEnvironment(value: FormDataEntryValue | null) {
  return value === IntegrationEnvironment.PRODUCTION
    ? IntegrationEnvironment.PRODUCTION
    : IntegrationEnvironment.SANDBOX;
}

export async function createCompanyAction(
  previousState: CompanyActionState = initialCompanyState,
  formData: FormData,
): Promise<CompanyActionState> {
  void previousState;
  const admin = await requireSuperAdmin();
  const name = cleanText(formData.get("name"));
  const legalName = cleanText(formData.get("legalName"));
  const code = normalizeCode(cleanText(formData.get("code")));
  const slug = normalizeSlug(cleanText(formData.get("slug")) || code || name);
  const providedToken = cleanText(formData.get("integrationToken"));
  const token = providedToken || generateCompanyToken();

  if (!name || !code || !slug) {
    return { ok: false, message: "Preencha nome, código e slug da empresa." };
  }

  if (code.length < 2 || slug.length < 2) {
    return { ok: false, message: "Código e slug precisam ter pelo menos 2 caracteres." };
  }

  const existing = await getPrisma().company.findFirst({
    where: {
      OR: [{ code }, { slug }],
    },
    select: { id: true },
  });

  if (existing) {
    return { ok: false, message: "Já existe empresa com este código ou slug." };
  }

  try {
    const company = await getPrisma().company.create({
      data: {
        name,
        legalName: legalName || null,
        code,
        slug,
        integrationTokenEncrypted: encryptSecret(token),
        integrationTokenLastFour: lastFour(token),
        integrationTokenUpdatedAt: new Date(),
      },
    });

    await auditLog({
      userId: admin.id,
      action: AuditAction.COMPANY_CREATED,
      message: `Empresa criada: ${company.name}`,
      metadata: {
        companyId: company.id,
        code,
        slug,
      },
    });
  } catch {
    return { ok: false, message: "Não foi possível criar a empresa. Confira se código ou slug já existem." };
  }

  revalidatePath("/companies");
  revalidatePath("/admin/users");

  return {
    ok: true,
    message: providedToken
      ? "Empresa criada com token informado."
      : "Empresa criada. Copie o token gerado agora; ele não será exibido novamente.",
    revealedToken: providedToken ? undefined : token,
  };
}

export async function updateCompanyAction(
  previousState: CompanyActionState = initialCompanyState,
  formData: FormData,
): Promise<CompanyActionState> {
  void previousState;
  const admin = await requireSuperAdmin();
  const companyId = cleanText(formData.get("companyId"));
  const name = cleanText(formData.get("name"));
  const legalName = cleanText(formData.get("legalName"));
  const code = normalizeCode(cleanText(formData.get("code")));
  const slug = normalizeSlug(cleanText(formData.get("slug")));
  const isActive = formData.get("isActive") === "on";

  if (!companyId || !name || !code || !slug) {
    return { ok: false, message: "Preencha nome, código e slug." };
  }

  const existing = await getPrisma().company.findFirst({
    where: {
      id: {
        not: companyId,
      },
      OR: [{ code }, { slug }],
    },
    select: { id: true },
  });

  if (existing) {
    return { ok: false, message: "Já existe outra empresa com este código ou slug." };
  }

  try {
    const company = await getPrisma().company.update({
      where: { id: companyId },
      data: {
        name,
        legalName: legalName || null,
        code,
        slug,
        isActive,
      },
    });

    await auditLog({
      userId: admin.id,
      action: AuditAction.COMPANY_UPDATED,
      message: `Empresa atualizada: ${company.name}`,
      metadata: {
        companyId: company.id,
        code,
        slug,
        isActive,
      },
    });
  } catch {
    return { ok: false, message: "Não foi possível atualizar. Confira se código ou slug já estão em uso." };
  }

  revalidatePath("/companies");
  revalidatePath("/admin/users");

  return { ok: true, message: "Empresa atualizada." };
}

export async function rotateCompanyTokenAction(
  previousState: CompanyActionState = initialCompanyState,
  formData: FormData,
): Promise<CompanyActionState> {
  void previousState;
  const admin = await requireSuperAdmin();
  const companyId = cleanText(formData.get("companyId"));
  const providedToken = cleanText(formData.get("integrationToken"));
  const token = providedToken || generateCompanyToken();

  if (!companyId) {
    return { ok: false, message: "Empresa não encontrada." };
  }

  const company = await getPrisma().company.update({
    where: { id: companyId },
    data: {
      integrationTokenEncrypted: encryptSecret(token),
      integrationTokenLastFour: lastFour(token),
      integrationTokenUpdatedAt: new Date(),
    },
  });

  await auditLog({
    userId: admin.id,
    action: AuditAction.COMPANY_TOKEN_ROTATED,
    message: `Token interno atualizado: ${company.name}`,
    metadata: {
      companyId: company.id,
      code: company.code,
    },
  });

  revalidatePath("/companies");

  return {
    ok: true,
    message: providedToken
      ? "Token interno atualizado com o valor informado."
      : "Novo token interno gerado. Copie agora; ele não será exibido novamente.",
    revealedToken: providedToken ? undefined : token,
  };
}

export async function upsertIntegrationCredentialAction(
  previousState: CompanyActionState = initialCompanyState,
  formData: FormData,
): Promise<CompanyActionState> {
  void previousState;
  const admin = await requireSuperAdmin();
  const companyId = cleanText(formData.get("companyId"));
  const provider = parseProvider(formData.get("provider"));
  const environment = parseEnvironment(formData.get("environment"));
  const credential = cleanText(formData.get("credential"));
  const refreshToken = cleanText(formData.get("refreshToken"));
  const externalAccountId = cleanText(formData.get("externalAccountId"));
  const status = cleanText(formData.get("status")) || "PENDING";

  if (!companyId) {
    return { ok: false, message: "Empresa não encontrada." };
  }

  const existing = await getPrisma().companyIntegrationCredential.findUnique({
    where: {
      companyId_provider: {
        companyId,
        provider,
      },
    },
  });

  await getPrisma().companyIntegrationCredential.upsert({
    where: {
      companyId_provider: {
        companyId,
        provider,
      },
    },
    update: {
      environment,
      externalAccountId: externalAccountId || null,
      status,
      credentialEncrypted: credential ? encryptSecret(credential) : existing?.credentialEncrypted,
      credentialLastFour: credential ? lastFour(credential) : existing?.credentialLastFour,
      refreshEncrypted: refreshToken ? encryptSecret(refreshToken) : existing?.refreshEncrypted,
      refreshLastFour: refreshToken ? lastFour(refreshToken) : existing?.refreshLastFour,
    },
    create: {
      companyId,
      provider,
      environment,
      externalAccountId: externalAccountId || null,
      status,
      credentialEncrypted: credential ? encryptSecret(credential) : null,
      credentialLastFour: credential ? lastFour(credential) : null,
      refreshEncrypted: refreshToken ? encryptSecret(refreshToken) : null,
      refreshLastFour: refreshToken ? lastFour(refreshToken) : null,
    },
  });

  await auditLog({
    userId: admin.id,
    action: AuditAction.INTEGRATION_CREDENTIAL_UPDATED,
    message: `Credencial de integração atualizada: ${provider}`,
    metadata: {
      companyId,
      provider,
      environment,
      hasCredential: Boolean(credential || existing?.credentialEncrypted),
      hasRefreshToken: Boolean(refreshToken || existing?.refreshEncrypted),
    },
  });

  revalidatePath("/companies");
  revalidatePath("/integrations");

  return { ok: true, message: "Credenciais salvas com segurança." };
}
