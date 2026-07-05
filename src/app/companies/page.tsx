import { Building2, CheckCircle2, LockKeyhole } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { getTotals, toBrl } from "@/lib/dashboard-summary";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const { user, companies } = await getProtectedPageContext();

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
          <h1>Cada empresa com contexto próprio. O consolidado vem depois.</h1>
          <p>Hoje a base inclui empresas demonstrativas; na fase real, cada uma terá suas conexões Asaas e Conta Azul.</p>
        </div>
      </section>

      <section className="company-page-list">
        {companies.map((company) => {
          const totals = getTotals([company]);
          return (
            <article className="company-page-card" key={company.id}>
              <div className="company-page-heading">
                <span className="company-dot large" style={{ background: company.accent }} />
                <div>
                  <h2>{company.name}</h2>
                  <p>{company.legalName}</p>
                </div>
                <span className="status status-good">{company.status}</span>
              </div>
              <div className="company-page-metrics">
                <span><strong>{toBrl(totals.receita)}</strong> receita</span>
                <span><strong>{toBrl(totals.resultado)}</strong> resultado</span>
                <span><strong>{company.metrics.clientes}</strong> clientes</span>
              </div>
              <div className="company-page-footer">
                <span><Building2 size={15} /> {company.segment}</span>
                <span><CheckCircle2 size={15} /> Asaas: {company.integrations.asaas}</span>
                <span><LockKeyhole size={15} /> Conta Azul: {company.integrations.contaAzul}</span>
              </div>
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
