import "server-only";

import { z } from "zod";

import { getPublicBaseUrl } from "@/lib/app-url";

export const CONTA_AZUL_PROVIDER_NAME = "Conta Azul";
export const CONTA_AZUL_AUTHORIZE_URL = "https://auth.contaazul.com/login";
export const CONTA_AZUL_TOKEN_URL = "https://auth.contaazul.com/oauth2/token";
export const CONTA_AZUL_API_BASE_URL = "https://api-v2.contaazul.com";
export const CONTA_AZUL_SCOPE = "openid profile aws.cognito.signin.user.admin";
export const CONTA_AZUL_OAUTH_TTL_MS = 10 * 60 * 1000;
export const CONTA_AZUL_CALLBACK_PATH = "/api/integrations/conta-azul/callback";

const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.coerce.number().optional(),
  refresh_token: z.string().min(1),
  token_type: z.string().optional(),
}).passthrough();

export type ContaAzulTokenResponse = z.infer<typeof tokenResponseSchema>;

export function getContaAzulRedirectUri(baseUrl?: string) {
  return process.env.CONTA_AZUL_REDIRECT_URI || `${baseUrl ?? getPublicBaseUrl()}${CONTA_AZUL_CALLBACK_PATH}`;
}

export function getContaAzulEnvironment() {
  return process.env.CONTA_AZUL_ENVIRONMENT === "PRODUCTION" ? "PRODUCTION" : "SANDBOX";
}

function getContaAzulClientConfig() {
  const clientId = process.env.CONTA_AZUL_CLIENT_ID;
  const clientSecret = process.env.CONTA_AZUL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Conta Azul OAuth credentials are not configured.");
  }

  return { clientId, clientSecret };
}

function getBasicAuthorizationHeader(clientId: string, clientSecret: string) {
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`, "utf8").toString("base64")}`;
}

export function buildContaAzulAuthorizeUrl(input: { state: string; redirectUri: string }) {
  const { clientId } = getContaAzulClientConfig();
  const authorizeUrl = new URL(CONTA_AZUL_AUTHORIZE_URL);

  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", input.redirectUri);
  authorizeUrl.searchParams.set("state", input.state);
  authorizeUrl.searchParams.set("scope", CONTA_AZUL_SCOPE);

  return authorizeUrl;
}

export async function exchangeContaAzulCodeForToken(input: {
  code: string;
  redirectUri: string;
}) {
  const { clientId, clientSecret } = getContaAzulClientConfig();
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code: input.code,
    redirect_uri: input.redirectUri,
  });

  return requestContaAzulToken(body, clientId, clientSecret);
}

export async function refreshContaAzulAccessToken(refreshToken: string) {
  const { clientId, clientSecret } = getContaAzulClientConfig();
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  return requestContaAzulToken(body, clientId, clientSecret);
}

async function requestContaAzulToken(
  body: URLSearchParams,
  clientId: string,
  clientSecret: string,
) {
  const response = await fetch(CONTA_AZUL_TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: getBasicAuthorizationHeader(clientId, clientSecret),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    cache: "no-store",
  });

  const rawBody = await response.text();
  const parsedBody = rawBody ? JSON.parse(rawBody) : null;

  if (!response.ok) {
    throw new Error(`Conta Azul OAuth request failed with status ${response.status}.`);
  }

  const parsedToken = tokenResponseSchema.safeParse(parsedBody);

  if (!parsedToken.success) {
    throw new Error("Conta Azul OAuth response did not include the expected tokens.");
  }

  return parsedToken.data;
}

export function getTokenExpiresAt(token: ContaAzulTokenResponse) {
  return token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : null;
}

export function isContaAzulOAuthExpired(issuedAt: number) {
  return Date.now() - issuedAt > CONTA_AZUL_OAUTH_TTL_MS;
}
