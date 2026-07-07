import crypto from "node:crypto";

import { NextResponse, type NextRequest } from "next/server";

import { getPublicBaseUrl, getPublicUrl } from "@/lib/app-url";
import { requireSuperAdmin } from "@/lib/auth";
import { buildContaAzulAuthorizeUrl, getContaAzulRedirectUri } from "@/lib/conta-azul";
import { getPrisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

function redirectToCompanies(request: NextRequest, status: string) {
  return NextResponse.redirect(getPublicUrl(`/companies?contaAzul=${status}`, request), 303);
}

export async function POST(request: NextRequest) {
  await requireSuperAdmin();

  const formData = await request.formData().catch(() => null);
  const companyId = String(formData?.get("companyId") ?? "").trim();

  if (!companyId) {
    return redirectToCompanies(request, "missing-company");
  }

  const company = await getPrisma().company.findUnique({
    where: { id: companyId },
    select: {
      id: true,
      isActive: true,
    },
  });

  if (!company) {
    return redirectToCompanies(request, "missing-company");
  }

  if (!company.isActive) {
    return redirectToCompanies(request, "inactive-company");
  }

  const state = crypto.randomBytes(32).toString("base64url");
  const session = await getSession();

  session.pendingContaAzulOAuth = {
    companyId,
    state,
    issuedAt: Date.now(),
  };
  await session.save();

  try {
    const redirectUri = getContaAzulRedirectUri(getPublicBaseUrl(request));
    const authorizeUrl = buildContaAzulAuthorizeUrl({ redirectUri, state });

    return NextResponse.redirect(authorizeUrl, 303);
  } catch {
    session.pendingContaAzulOAuth = undefined;
    await session.save();

    return redirectToCompanies(request, "missing-config");
  }
}
