import { BadgeCheck, CircleDollarSign, Megaphone, MousePointerClick, PenTool, Target } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { GoalBarsChart } from "@/components/charts/goal-bars-chart";
import { toBrl } from "@/lib/dashboard-summary";
import {
  channelPerformance,
  contentPlan,
  contentStatusClass,
  marketingOkrs,
  maturityFunnel,
} from "@/lib/demo-marketing-data";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

const compact = new Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 });

export default async function MarketingPage() {
  const { user } = await getProtectedPageContext();

  const investimento = channelPerformance.reduce((total, channel) => total + channel.investimento, 0);
  const retorno = channelPerformance.reduce((total, channel) => total + channel.retorno, 0);
  const leads = channelPerformance.reduce((total, channel) => total + channel.leads, 0);
  const roi = investimento ? retorno / investimento : 0;
  const cpl = leads ? investimento / leads : 0;
  const maxFunnelValue = Math.max(...maturityFunnel.map((stage) => stage.value), 1);

  return (
    <AppShell
      user={user}
      eyebrow="Marketing"
      title="Marketing & expansão"
      subtitle="Funil de maturidade, desempenho por canal, calendário de conteúdo e OKRs de marketing."
    >
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Geração de demanda</span>
          <h1>Marketing medido como investimento, não como despesa.</h1>
          <p>Dados demonstrativos do mês corrente — prontos para receber os números reais dos canais.</p>
        </div>
      </section>

      <section className="kpi-grid">
        <article className="kpi-card">
          <div className="kpi-icon"><CircleDollarSign size={18} /></div>
          <span>Investimento no mês</span>
          <strong>{toBrl(investimento)}</strong>
          <em>{toBrl(retorno)} de retorno atribuído</em>
        </article>
        <article className="kpi-card">
          <div className="kpi-icon"><Target size={18} /></div>
          <span>ROI consolidado</span>
          <strong>{roi.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}x</strong>
          <em>meta do trimestre: 4,0x</em>
        </article>
        <article className="kpi-card">
          <div className="kpi-icon"><MousePointerClick size={18} /></div>
          <span>Leads no mês</span>
          <strong>{leads}</strong>
          <em>todos os canais somados</em>
        </article>
        <article className="kpi-card">
          <div className="kpi-icon"><BadgeCheck size={18} /></div>
          <span>CPL médio</span>
          <strong>{toBrl(cpl)}</strong>
          <em>meta: R$ 38 por lead</em>
        </article>
      </section>

      <section className="page-two-column">
        <article className="page-section">
          <div className="section-heading">
            <Megaphone size={20} />
            <div>
              <span className="eyebrow">Funil de maturidade</span>
              <h2>Do alcance ao contrato</h2>
            </div>
          </div>
          <div className="funnel-list">
            {maturityFunnel.map((stage) => (
              <div className="funnel-row" key={stage.name}>
                <div className="funnel-copy">
                  <strong>{stage.name}</strong>
                  <em>{stage.label}</em>
                </div>
                <div className="funnel-track">
                  <span
                    className="funnel-bar"
                    style={{ width: `${Math.max((stage.value / maxFunnelValue) * 100, 2)}%` }}
                  />
                </div>
                <span className="funnel-value">{compact.format(stage.value)}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="page-section">
          <div className="section-heading">
            <CircleDollarSign size={20} />
            <div>
              <span className="eyebrow">Canais</span>
              <h2>Investimento vs retorno</h2>
            </div>
          </div>
          <GoalBarsChart
            data={channelPerformance}
            xKey="channel"
            series={[
              { dataKey: "investimento", label: "Investimento", color: "#cccccc" },
              { dataKey: "retorno", label: "Retorno", color: "#0066cc" },
            ]}
          />
        </article>
      </section>

      <section className="page-two-column">
        <article className="page-section">
          <div className="section-heading">
            <PenTool size={20} />
            <div>
              <span className="eyebrow">Trimestre</span>
              <h2>Planejamento de conteúdo</h2>
            </div>
          </div>
          <div className="content-plan">
            {contentPlan.map((item) => (
              <article className="content-plan-row" key={item.title}>
                <span className="content-plan-month">{item.month}</span>
                <div>
                  <strong>{item.title}</strong>
                  <em>{item.format}</em>
                </div>
                <span className={contentStatusClass(item.status)}>{item.status}</span>
              </article>
            ))}
          </div>
        </article>

        <article className="page-section">
          <div className="section-heading">
            <Target size={20} />
            <div>
              <span className="eyebrow">OKRs de marketing · T3 2026</span>
              <h2>Compromissos do trimestre</h2>
            </div>
          </div>
          <div className="okr-results">
            {marketingOkrs.map((okr) => (
              <div className="okr-result" key={okr.label}>
                <div className="okr-result-copy">
                  <span>{okr.label}</span>
                  <em>
                    {okr.owner} · {okr.progress}%
                  </em>
                </div>
                <div className="progress-track" role="progressbar" aria-valuenow={okr.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progresso: ${okr.label}`}>
                  <span className="progress-fill" style={{ width: `${okr.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AppShell>
  );
}
