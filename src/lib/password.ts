import "server-only";

import bcrypt from "bcryptjs";

const COMMON_PASSWORDS = new Set([
  "12345678",
  "123456789",
  "password",
  "password1",
  "admin123",
  "qwerty123",
  "mrgestor",
  "nofrontscale",
]);

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function validatePasswordPolicy(password: string, context: string[] = []) {
  const normalized = password.trim().toLowerCase();
  const blockedByContext = context
    .filter(Boolean)
    .map((item) => item.toLowerCase())
    .some((item) => item.length >= 4 && normalized.includes(item));

  if (password.length < 12) {
    return "A senha precisa ter pelo menos 12 caracteres.";
  }

  if (COMMON_PASSWORDS.has(normalized) || blockedByContext) {
    return "Use uma senha menos previsível e sem dados da empresa ou do usuário.";
  }

  return null;
}
