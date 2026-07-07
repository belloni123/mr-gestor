import "server-only";

import { generateSecret, generateURI, verifySync } from "otplib";
import QRCode from "qrcode";

export function generateTotpSecret() {
  return generateSecret({ length: 20 });
}

export function verifyTotp(token: string, secret: string) {
  const sanitized = token.replace(/\s+/g, "");

  if (!/^\d{6}$/.test(sanitized)) {
    return false;
  }

  const result = verifySync({
    strategy: "totp",
    token: sanitized,
    secret,
    period: 30,
    digits: 6,
    epochTolerance: 1,
  });

  return result.valid === true;
}

export async function getTotpEnrollmentPayload(email: string, secret: string) {
  const serviceName = "MR Gestor";
  const otpauth = generateURI({
    strategy: "totp",
    issuer: serviceName,
    label: email,
    secret,
    period: 30,
    digits: 6,
  });
  const qrDataUrl = await QRCode.toDataURL(otpauth, {
    margin: 1,
    width: 220,
  });

  return {
    otpauth,
    qrDataUrl,
    secret,
  };
}
