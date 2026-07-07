import { DatabaseZap, KeyRound, RefreshCcw, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { getProtectedPageContext } from "@/lib/protected-page";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const { user } = await getProtectedPageContext();
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const companies = await getPrisma().company.findMany({
    where: isSuperAdmin
      ? undefined
      : {
          slug: {
            in: user.companies.map((company) => company.slug),
          },
        },
    include: {
      integrationCredentials: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <AppShell
      user={user}
      eyebrow="Integrações"
      title="Asaas e Conta Azul"
      subtitle="Painel operacional para acompanhar provedores, ambientes, credenciais e próximas etapas de sincronização."
    >
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Dados reais</span>
          <h1>As integrações ficam por último, mas a arquitetura já está preparada.</h1>
          <p>
            Esta página mostra status por empresa e documenta o que será conectado quando as credenciais oficiais estiverem
            prontas.
          </p>
        </div>
      </section>

      <section className="integration-status-grid">
        {companies.map((company) => {
          const asaas = company.integrationCredentials.find((item) => item.provider === "ASAAS");
          const contaAzul = company.integrationCredentials.find((item) => item.provider === "CONTA_AZUL");

          return (
            <article className="integration-company-card" key={company.id}>
              <div className="company-page-heading">
                <span className="company-dot large" />
                <div>
                  <h2>{company.name}</h2>
                  <p>Código {company.code ?? "pendente"} · token interno {company.integrationTokenLastFour ? `...${company.integrationTokenLastFour}` : "pendente"}</p>
                </div>
              </div>
              <div className="provider-list">
                <ProviderStatus
                  description="API key, webhooks e reconciliação."
                  environment={asaas?.environment}
                  lastFour={asaas?.credentialLastFour}
                  name="Asaas"
                  status={asaas?.status}
                />
                <ProviderStatus
                  description="OAuth 2.0, refresh token e polling recorrente."
                  environment={contaAzul?.environment}
                  lastFour={contaAzul?.credentialLastFour}
                  name="Conta Azul"
                  status={contaAzul?.status}
                />
              </div>
            </article>
          );
        })}
      </section>

      <section className="page-card-grid">
        <article className="page-card">
          <KeyRound size={20} />
          <h2>Credenciais</h2>
          <p>API keys, access tokens e refresh tokens devem ser criptografados por empresa e nunca aparecer em logs.</p>
        </article>
        <article className="page-card">
          <RefreshCcw size={20} />
          <h2>Sincronização</h2>
          <p>Dashboards devem ler dados internos normalizados. APIs externas entram por jobs, webhooks e conciliação.</p>
        </article>
        <article className="page-card">
          <ShieldCheck size={20} />
          <h2>Segurança</h2>
          <p>Asaas valida webhook com token dedicado. Conta Azul exige reautorização quando refresh/OAuth falhar.</p>
        </article>
        <article className="page-card">
          <DatabaseZap size={20} />
          <h2>Próxima fase</h2>
          <p>Criar tela segura para cadastrar credenciais e depois ativar Sandbox antes de produção.</p>
        </article>
      </section>
    </AppShell>
  );
}

function ProviderStatus({
  name,
  status,
  description,
  environment,
  lastFour,
}: {
  name: string;
  status?: string;
  description: string;
  environment?: string;
  lastFour?: string | null;
}) {
  const connected = status === "CONNECTED";
  return (
    <div className="provider-status">
      <div>
        <strong>{name}</strong>
        <p>
          {description} {environment ? `Ambiente: ${environment === "PRODUCTION" ? "produção" : "sandbox"}.` : ""}
          {" "}
          {lastFour ? `Token ...${lastFour}.` : "Token pendente."}
        </p>
      </div>
      <span className={connected ? "status status-good" : "status status-warning"}>{formatProviderStatus(status)}</span>
    </div>
  );
}

function formatProviderStatus(status?: string) {
  if (status === "CONNECTED") return "Conectado";
  if (status === "READY") return "Pronto";
  if (status === "ERROR") return "Erro";
  return "Pendente";
}
