import Link from "next/link";

import { toggleUserActiveAction } from "@/app/admin/users/actions";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { ResetPasswordForm, UserCompaniesForm } from "@/components/admin/user-admin-forms";
import { requireSuperAdmin } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireSuperAdmin();

  const prisma = getPrisma();
  const [companies, users] = await Promise.all([
    prisma.company.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
      },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        companies: {
          include: {
            company: true,
          },
        },
      },
    }),
  ]);

  return (
    <main className="settings-page">
      <section className="settings-shell admin-shell">
        <div className="settings-topbar">
          <Link href="/settings">Voltar às configurações</Link>
          <strong>Administração de usuários</strong>
        </div>

        <CreateUserForm companies={companies} />

        <section className="settings-card user-list-card">
          <div className="settings-heading">
            <span>RBAC</span>
            <h1>Usuários cadastrados</h1>
            <p>Super admin vê tudo. Editor só vê e edita empresas marcadas abaixo.</p>
          </div>

          <div className="admin-user-list">
            {users.map((user) => (
              <article className="admin-user-row" key={user.id}>
                <div className="admin-user-main">
                  <div>
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <div className="admin-badges">
                    <span>{user.role === "SUPER_ADMIN" ? "Super admin" : "Editor"}</span>
                    <span>{user.mfaEnabled ? "2FA ativo" : "2FA pendente"}</span>
                    <span>{user.isActive ? "Ativo" : "Inativo"}</span>
                  </div>
                </div>

                <UserCompaniesForm
                  companies={companies}
                  userCompanies={user.companies.map((item) => ({ slug: item.company.slug }))}
                  userId={user.id}
                />

                <ResetPasswordForm userId={user.id} />

                <form action={toggleUserActiveAction}>
                  <input name="userId" type="hidden" value={user.id} />
                  <input name="nextActive" type="hidden" value={String(!user.isActive)} />
                  <button className="danger-action" type="submit">
                    {user.isActive ? "Desativar usuário" : "Ativar usuário"}
                  </button>
                </form>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
