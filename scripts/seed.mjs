import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const companies = [
  {
    slug: "b16",
    name: "Agencia B16",
    legalName: "Agencia B16 Comunicacao Ltda.",
  },
  {
    slug: "maestro",
    name: "Maestro Tiago Santos",
    legalName: "Tiago Santos Producoes Musicais",
  },
];

function env(name, required = true) {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`${name} is required`);
  }
  return value ?? "";
}

async function upsertBootstrapUser({ email, name, password, role, companySlugs = [] }) {
  const normalizedEmail = email.toLowerCase().trim();
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: {
      name,
      role,
      passwordHash,
      mustChangePassword: true,
      isActive: true,
    },
    create: {
      email: normalizedEmail,
      name,
      role,
      passwordHash,
      mustChangePassword: true,
      isActive: true,
    },
  });

  if (companySlugs.length) {
    const allowedCompanies = await prisma.company.findMany({
      where: {
        slug: {
          in: companySlugs,
        },
      },
    });

    await prisma.userCompany.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.userCompany.createMany({
      data: allowedCompanies.map((company) => ({
        userId: user.id,
        companyId: company.id,
        canEdit: true,
      })),
      skipDuplicates: true,
    });
  }

  return user;
}

async function main() {
  for (const company of companies) {
    await prisma.company.upsert({
      where: { slug: company.slug },
      update: company,
      create: company,
    });
  }

  await upsertBootstrapUser({
    email: env("BOOTSTRAP_SUPER_ADMIN_EMAIL"),
    name: env("BOOTSTRAP_SUPER_ADMIN_NAME"),
    password: env("BOOTSTRAP_SUPER_ADMIN_PASSWORD"),
    role: UserRole.SUPER_ADMIN,
  });

  const editorEmail = env("BOOTSTRAP_EDITOR_EMAIL", false);
  const editorPassword = env("BOOTSTRAP_EDITOR_PASSWORD", false);
  const editorName = env("BOOTSTRAP_EDITOR_NAME", false);

  if (editorEmail && editorPassword && editorName) {
    await upsertBootstrapUser({
      email: editorEmail,
      name: editorName,
      password: editorPassword,
      role: UserRole.EDITOR,
      companySlugs: env("BOOTSTRAP_EDITOR_COMPANIES", false)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  }

  console.log("Seed completed without printing credentials.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
