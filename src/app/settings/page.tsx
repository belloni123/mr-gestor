import Link from "next/link";
import { Building2, DatabaseZap, KeyRound, ShieldCheck, UserCog } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { user } = await getProtectedPageContext();

  return (
    <AppShell
      user={user}
      eyebrow="Configuracoes"
      title="Central administrativa"
      subtitle="Ajustes de conta, usuarios, permissoes, empresas, integracoes e seguranca em um lugar proprio."
    >
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Ajustes</span>
          <h1>Configuracao nao e apenas trocar senha.</h1>
          <p>
            Super admin tem acesso a usuarios, empresas, permissoes e governanca. Editor ve somente a propria seguranca e
            empresas liberadas.
          </p>
        </div>
      </section>

      <section className="settings-hub-grid">
        <SettingsLink
          href="/account/security"
          icon={KeyRound}
          title="Minha seguranca"
          text="Trocar senha e revisar seu nivel de permissao."
        />
        {user.role === "SUPER_ADMIN" ? (
          <>
            <SettingsLink
              href="/admin/users"
              icon={UserCog}
              title="Usuarios e editores"
              text="Criar editor, resetar senha, ativar/desativar acesso e marcar empresas permitidas."
            />
            <SettingsLink
              href="/companies"
              icon={Building2}
              title="Empresas"
              text="Revisar empresas cadastradas e preparar futuras configuracoes por CNPJ/cliente."
            />
            <SettingsLink
              href="/integrations"
              icon={DatabaseZap}
              title="Integracoes"
              text="Acompanhar Asaas, Conta Azul, ambientes e proximas credenciais."
            />
            <SettingsLink
              href="/governance"
              icon={ShieldCheck}
              title="Governanca"
              text="Ver controles de acesso, auditoria e checklist de sigilo."
            />
          </>
        ) : null}
      </section>

      <section className="page-section">
        <div className="section-heading">
          <ShieldCheck size={20} />
          <div>
            <span className="eyebrow">Seu acesso</span>
            <h2>{user.role === "SUPER_ADMIN" ? "Super admin" : "Editor"}</h2>
          </div>
        </div>
        <div className="permission-list">
          {user.role === "SUPER_ADMIN" ? <span>Todas as empresas</span> : null}
          {user.companies.map((company) => (
            <span key={company.id}>{company.name}</span>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function SettingsLink({
  href,
  icon: Icon,
  title,
  text,
}: {
  href: string;
  icon: typeof KeyRound;
  title: string;
  text: string;
}) {
  return (
    <Link className="settings-hub-card" href={href}>
      <Icon size={21} />
      <strong>{title}</strong>
      <p>{text}</p>
    </Link>
  );
}
