import { AuditAction, IntegrationProvider } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { getPublicBaseUrl, getPublicUrl } from "@/lib/app-url";
import { auditLog, requireSuperAdmin } from "@/lib/auth";
import {
  exchangeContaAzulCodeForToken,
  getContaAzulEnvironment,
  getContaAzulRedirectUri,
  isContaAzulOAuthExpired,
} from "@/lib/conta-azul";
import { encryptSecret } from "@/lib/crypto";
import { getPrisma } from "@/lib/prisma";
import { getClientIp, getUserAgent } from "@/lib/request";
import { getSession } from "@/lib/session";

function lastFour(value: string) {
  return value.slice(-4);
}

function redirectToCompanies(request: NextRequest, status: string) {
  return NextResponse.redirect(getPublicUrl(`/companies?contaAzul=${status}`, request), 303);
}

export async function GET(request: NextRequest) {
  const admin = await requireSuperAdmin();
  const session = await getSession();
  const pendingOAuth = session.pendingContaAzulOAuth;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");

  if (!pendingOAuth) {
    return redirectToCompanies(request, "missing-session");
  }

  if (oauthError) {
    session.pendingContaAzulOAuth = undefined;
    await session.save();

    return redirectToCompanies(request, "denied");
  }

  if (!code || !state || state !== pendingOAuth.state || isContaAzulOAuthExpired(pendingOAuth.issuedAt)) {
    session.pendingContaAzulOAuth = undefined;
    await session.save();

    return redirectToCompanies(request, "invalid-state");
  }

  try {
    const redirectUri = getContaAzulRedirectUri(getPublicBaseUrl(request));
    const token = await exchangeContaAzulCodeForToken({ code, redirectUri });
    const company = await getPrisma().company.findUnique({
      where: { id: pendingOAuth.companyId },
      select: {
        id: true,
        name: true,
      },
    });

    if (!company) {
      session.pendingContaAzulOAuth = undefined;
      await session.save();

      return redirectToCompanies(request, "missing-company");
    }

    await getPrisma().companyIntegrationCredential.upsert({
      where: {
        companyId_provider: {
          companyId: company.id,
          provider: IntegrationProvider.CONTA_AZUL,
        },
      },
      update: {
        environment: getContaAzulEnvironment(),
        credentialEncrypted: encryptSecret(token.access_token),
        credentialLastFour: lastFour(token.access_token),
        refreshEncrypted: encryptSecret(token.refresh_token),
        refreshLastFour: lastFour(token.refresh_token),
        status: "CONNECTED",
      },
      create: {
        companyId: company.id,
        provider: IntegrationProvider.CONTA_AZUL,
        environment: getContaAzulEnvironment(),
        credentialEncrypted: encryptSecret(token.access_token),
        credentialLastFour: lastFour(token.access_token),
        refreshEncrypted: encryptSecret(token.refresh_token),
        refreshLastFour: lastFour(token.refresh_token),
        status: "CONNECTED",
      },
    });

    await auditLog({
      userId: admin.id,
      action: AuditAction.INTEGRATION_CREDENTIAL_UPDATED,
      message: `Conta Azul conectada: ${company.name}`,
      metadata: {
        companyId: company.id,
        provider: IntegrationProvider.CONTA_AZUL,
        environment: getContaAzulEnvironment(),
      },
      ip: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    session.pendingContaAzulOAuth = undefined;
    await session.save();

    revalidatePath("/companies");
    revalidatePath("/integrations");

    return redirectToCompanies(request, "connected");
  } catch (error) {
    console.error("Conta Azul OAuth callback failed.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    await getPrisma().companyIntegrationCredential.upsert({
      where: {
        companyId_provider: {
          companyId: pendingOAuth.companyId,
          provider: IntegrationProvider.CONTA_AZUL,
        },
      },
      update: {
        status: "ERROR",
      },
      create: {
        companyId: pendingOAuth.companyId,
        provider: IntegrationProvider.CONTA_AZUL,
        environment: getContaAzulEnvironment(),
        status: "ERROR",
      },
    }).catch(() => undefined);

    session.pendingContaAzulOAuth = undefined;
    await session.save();

    revalidatePath("/companies");
    revalidatePath("/integrations");

    return redirectToCompanies(request, "error");
  }
}
