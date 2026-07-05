import Link from "next/link";

import { ChangePasswordForm } from "@/components/account/change-password-form";
import { requireSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type AccountSecurityPageProps = {
  searchParams: Promise<{
    required?: string;
  }>;
};

export default async function AccountSecurityPage({ searchParams }: AccountSecurityPageProps) {
  const user = await requireSessionUser();
  const params = await searchParams;

  return (
    <main className="settings-page">
      <section className="settings-shell">
        <div className="settings-topbar">
          <Link href="/settings">Voltar as configuracoes</Link>
          <strong>{user.name}</strong>
        </div>

        {params.required ? (
          <div className="security-notice">
            Por seguranca, troque a senha inicial antes de acessar os dados das empresas.
          </div>
        ) : null}

        <ChangePasswordForm />

        <aside className="settings-card settings-summary">
          <span>Permissao</span>
          <h2>{user.role === "SUPER_ADMIN" ? "Super admin" : "Editor"}</h2>
          <p>
            {user.role === "SUPER_ADMIN"
              ? "Acesso completo para usuarios, empresas, auditoria e configuracoes."
              : "Acesso limitado as empresas marcadas para sua conta."}
          </p>
          <div className="permission-list">
            {user.companies.map((company) => (
              <span key={company.id}>{company.name}</span>
            ))}
            {user.role === "SUPER_ADMIN" ? <span>Todas as empresas</span> : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
