import {
  CalendarClock,
  CircleDollarSign,
  Filter,
  Gauge,
  Handshake,
  Phone,
  Presentation,
  Send,
  Timer,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { GoalBarsChart } from "@/components/charts/goal-bars-chart";
import {
  crmActivities,
  funnelStages,
  monthlyGoals,
  opportunities,
  stageClass,
} from "@/lib/demo-crm-data";
import { toBrl } from "@/lib/dashboard-summary";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

const activityIcons = {
  "Ligação": Phone,
  "Reunião": Presentation,
  "Proposta": Send,
  "Follow-up": CalendarClock,
} as const;

export default async function CrmPage() {
  const { user, companies } = await getProtectedPageContext();
  const allowedSlugs = new Set(companies.map((company) => company.id));
  const companyNames = new Map(companies.map((company) => [company.id, company.name]));

  const visibleOpportunities = opportunities.filter((opportunity) => allowedSlugs.has(opportunity.companySlug));
  const visibleActivities = crmActivities.filter((activity) => allowedSlugs.has(activity.companySlug));

  const pipelineValue = visibleOpportunities.reduce((total, item) => total + item.value, 0);
  const maxStageValue = Math.max(...funnelStages.map((stage) => stage.value), 1);
  const conversion = funnelStages.length
    ? Math.round((funnelStages[funnelStages.length - 1].count / funnelStages[0].count) * 100)
    : 0;
  const avgTicket = visibleOpportunities.length ? pipelineValue / visibleOpportunities.length : 0;

  return (
    <AppShell
      user={user}
      eyebrow="CRM & Vendas"
      title="Funil comercial"
      subtitle="Oportunidades, estágios, metas e atividades da semana — filtrado pelas empresas autorizadas ao seu usuário."
    >
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Máquina comercial</span>
          <h1>Vender é rotina: funil visível, próximo passo definido.</h1>
          <p>Dados demonstrativos preparados para a futura integração com o CRM e com o Asaas.</p>
        </div>
      </section>

      <section className="kpi-grid">
        <article className="kpi-card">
          <div className="kpi-icon"><CircleDollarSign size={18} /></div>
          <span>Pipeline aberto</span>
          <strong>{toBrl(pipelineValue)}</strong>
          <em>{visibleOpportunities.length} oportunidades ativas</em>
        </article>
        <article className="kpi-card">
          <div className="kpi-icon"><Filter size={18} /></div>
          <span>Conversão do funil</span>
          <strong>{conversion}%</strong>
          <em>de prospecção a fechamento</em>
        </article>
        <article className="kpi-card">
          <div className="kpi-icon"><Gauge size={18} /></div>
          <span>Ticket médio previsto</span>
          <strong>{toBrl(avgTicket)}</strong>
          <em>por oportunidade no funil</em>
        </article>
        <article className="kpi-card">
          <div className="kpi-icon"><Timer size={18} /></div>
          <span>Ciclo médio</span>
          <strong>24 dias</strong>
          <em>da prospecção ao contrato</em>
        </article>
      </section>

      <section className="page-two-column">
        <article className="page-section">
          <div className="section-heading">
            <Filter size={20} />
            <div>
              <span className="eyebrow">Funil consolidado</span>
              <h2>Estágios e valores</h2>
            </div>
          </div>
          <div className="funnel-list">
            {funnelStages.map((stage) => (
              <div className="funnel-row" key={stage.name}>
                <div className="funnel-copy">
                  <strong>{stage.name}</strong>
                  <em>{stage.count} negócios</em>
                </div>
                <div className="funnel-track">
                  <span className="funnel-bar" style={{ width: `${(stage.value / maxStageValue) * 100}%` }} />
                </div>
                <span className="funnel-value">{toBrl(stage.value)}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="page-section">
          <div className="section-heading">
            <Handshake size={20} />
            <div>
              <span className="eyebrow">Meta vs realizado</span>
              <h2>Novas receitas por mês</h2>
            </div>
          </div>
          <GoalBarsChart
            data={monthlyGoals}
            xKey="month"
            series={[
              { dataKey: "meta", label: "Meta", color: "#cccccc" },
              { dataKey: "realizado", label: "Realizado", color: "#0066cc" },
            ]}
          />
        </article>
      </section>

      <section className="table-card">
        <div className="card-heading">
          <div>
            <span className="eyebrow">{visibleOpportunities.length} registros</span>
            <h2>Oportunidades em aberto</h2>
          </div>
          <Handshake size={20} />
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Oportunidade</th>
                <th>Empresa</th>
                <th>Estágio</th>
                <th>Valor</th>
                <th>Responsável</th>
                <th>Próximo passo</th>
                <th>Previsão</th>
              </tr>
            </thead>
            <tbody>
              {visibleOpportunities.map((opportunity) => (
                <tr key={opportunity.id}>
                  <td>{opportunity.name}</td>
                  <td>{companyNames.get(opportunity.companySlug)}</td>
                  <td>
                    <span className={stageClass(opportunity.stage)}>{opportunity.stage}</span>
                  </td>
                  <td>{toBrl(opportunity.value)}</td>
                  <td>{opportunity.owner}</td>
                  <td>{opportunity.nextStep}</td>
                  <td>{new Date(`${opportunity.expectedClose}T12:00:00`).toLocaleDateString("pt-BR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!visibleOpportunities.length ? (
          <div className="empty-state">Sem oportunidades nas empresas autorizadas.</div>
        ) : null}
      </section>

      <section className="page-section">
        <div className="section-heading">
          <CalendarClock size={20} />
          <div>
            <span className="eyebrow">Agenda comercial</span>
            <h2>Atividades da semana</h2>
          </div>
        </div>
        <div className="activity-list">
          {visibleActivities.map((activity) => {
            const Icon = activityIcons[activity.kind];
            return (
              <article className="activity-row" key={`${activity.title}-${activity.when}`}>
                <span className="activity-icon">
                  <Icon size={16} />
                </span>
                <div>
                  <strong>{activity.title}</strong>
                  <p>
                    {activity.kind} · {companyNames.get(activity.companySlug)} · {activity.owner}
                  </p>
                </div>
                <em>{activity.when}</em>
              </article>
            );
          })}
          {!visibleActivities.length ? <div className="empty-state">Sem atividades planejadas.</div> : null}
        </div>
      </section>
    </AppShell>
  );
}
