import { Building2, CheckCircle2, KeyRound, LockKeyhole, PlugZap } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { CompanyAdminForms, CreateCompanyForm } from "@/components/companies/company-admin-forms";
import { getDashboardCompaniesForSlugs } from "@/lib/demo-dashboard-data";
import { getTotals, toBrl } from "@/lib/dashboard-summary";
import { getProtectedPageContext } from "@/lib/protected-page";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type CompaniesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const params = searchParams ? await searchParams : {};
  const contaAzulStatus = typeof params.contaAzul === "string" ? params.contaAzul : undefined;
  const { user } = await getProtectedPageContext();
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const prisma = getPrisma();
  const registeredCompanies = await prisma.company.findMany({
    where: isSuperAdmin
      ? undefined
      : {
          slug: {
            in: user.companies.map((company) => company.slug),
          },
        },
    include: {
      integrationCredentials: {
        orderBy: {
          provider: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
  const demoCompanies = getDashboardCompaniesForSlugs("all");
  const demoBySlug = new Map(demoCompanies.map((company) => [company.id, company]));

  return (
    <AppShell
      user={user}
      eyebrow="Empresas"
      title="Empresas cadastradas"
      subtitle="Base multiempresa para visualizar dados isolados, permissão por editor e consolidação seletiva."
    >
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Multiempresa</span>
          <h1>Cada empresa com código, token e permissões próprias.</h1>
          <p>
            Cadastre empresas pelo painel, vincule editores e prepare credenciais separadas para Asaas e Conta Azul.
          </p>
        </div>
      </section>

      {isSuperAdmin ? <CreateCompanyForm /> : null}

      {contaAzulStatus ? <ContaAzulOAuthNotice status={contaAzulStatus} /> : null}

      <section className="company-page-list">
        {registeredCompanies.map((company) => {
          const demoCompany = demoBySlug.get(company.slug);
          const totals = getTotals(demoCompany ? [demoCompany] : []);
          const asaas = company.integrationCredentials.find((item) => item.provider === "ASAAS");
          const contaAzul = company.integrationCredentials.find((item) => item.provider === "CONTA_AZUL");

          return (
            <article className="company-page-card" key={company.id}>
              <div className="company-page-heading">
                <span className="company-dot large" style={{ background: demoCompany?.accent ?? "#0066cc" }} />
                <div>
                  <h2>{company.name}</h2>
                  <p>{company.legalName ?? "Razão social não informada"}</p>
                </div>
                <span className={company.isActive ? "status status-good" : "status status-warning"}>
                  {company.isActive ? "Ativa" : "Inativa"}
                </span>
              </div>
              <div className="company-page-metrics">
                <span><strong>{toBrl(totals.receita)}</strong> receita</span>
                <span><strong>{toBrl(totals.resultado)}</strong> resultado</span>
                <span><strong>{demoCompany?.metrics.clientes ?? 0}</strong> clientes</span>
              </div>
              <div className="company-page-footer">
                <span><Building2 size={15} /> Código: {company.code ?? "pendente"}</span>
                <span><KeyRound size={15} /> Token: {company.integrationTokenLastFour ? `...${company.integrationTokenLastFour}` : "pendente"}</span>
                <span><CheckCircle2 size={15} /> Asaas: {formatCredentialStatus(asaas?.status)}</span>
                <span><LockKeyhole size={15} /> Conta Azul: {formatCredentialStatus(contaAzul?.status)}</span>
              </div>
              {isSuperAdmin ? <CompanyAdminForms company={company} /> : null}
            </article>
          );
        })}
      </section>

      {registeredCompanies.length === 0 ? (
        <section className="empty-state">
          <PlugZap size={22} />
          <h2>Nenhuma empresa cadastrada para este acesso.</h2>
          <p>O super admin pode cadastrar a primeira empresa nesta página.</p>
        </section>
      ) : null}
    </AppShell>
  );
}

function formatCredentialStatus(status?: string) {
  if (status === "CONNECTED") return "Conectado";
  if (status === "READY") return "Pronto";
  if (status === "ERROR") return "Erro";
  return "Pendente";
}

function ContaAzulOAuthNotice({ status }: { status: string }) {
  const success = status === "connected";
  const messages: Record<string, string> = {
    connected: "Conta Azul conectada com sucesso. Os tokens foram salvos criptografados para a empresa selecionada.",
    denied: "Autorização da Conta Azul cancelada ou negada.",
    error: "Não foi possível concluir a conexão com a Conta Azul. Confira a URL de redirecionamento e tente novamente.",
    "inactive-company": "A empresa selecionada está inativa.",
    "invalid-state": "A sessão de autorização expirou ou ficou inválida. Inicie a conexão novamente.",
    "missing-company": "Empresa não encontrada para iniciar a conexão.",
    "missing-config": "As credenciais OAuth da Conta Azul ainda não estão configuradas no ambiente.",
    "missing-session": "A sessão de autorização não foi encontrada. Inicie a conexão novamente.",
  };

  return (
    <section className={success ? "secure-result success" : "secure-result error"}>
      <span>{messages[status] ?? messages.error}</span>
    </section>
  );
}
