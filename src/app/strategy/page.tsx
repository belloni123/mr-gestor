import { Compass, Flag, HeartHandshake, MessageCircle, Target, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { planPhases, quarterOkrs, strategicPillars, strategyIdentity } from "@/lib/demo-strategy-data";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

export default async function StrategyPage() {
  const { user } = await getProtectedPageContext();

  return (
    <AppShell
      user={user}
      eyebrow="Estratégia"
      title="Plano estratégico"
      subtitle="Identidade, pilares, OKRs do trimestre e as fases do planejamento — a mesma página para todo o time."
    >
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Norte da operação</span>
          <h1>Estratégia visível é estratégia executada.</h1>
          <p>Este módulo traduz o planejamento em algo que se consulta todo dia, não em um PDF esquecido.</p>
        </div>
      </section>

      <section className="page-two-column">
        <article className="page-section">
          <div className="section-heading">
            <Compass size={20} />
            <div>
              <span className="eyebrow">Identidade</span>
              <h2>Missão e visão</h2>
            </div>
          </div>
          <div className="identity-block">
            <div>
              <strong>Missão</strong>
              <p>{strategyIdentity.mission}</p>
            </div>
            <div>
              <strong>Visão</strong>
              <p>{strategyIdentity.vision}</p>
            </div>
          </div>
        </article>

        <article className="page-section">
          <div className="section-heading">
            <HeartHandshake size={20} />
            <div>
              <span className="eyebrow">Cultura</span>
              <h2>Regras inegociáveis</h2>
            </div>
          </div>
          <ul className="identity-list">
            {strategyIdentity.culture.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="page-two-column">
        <article className="page-section">
          <div className="section-heading">
            <Users size={20} />
            <div>
              <span className="eyebrow">ICP</span>
              <h2>Para quem trabalhamos</h2>
            </div>
          </div>
          <ul className="identity-list">
            {strategyIdentity.icp.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="page-section">
          <div className="section-heading">
            <MessageCircle size={20} />
            <div>
              <span className="eyebrow">Comunicação</span>
              <h2>Política de comunicação</h2>
            </div>
          </div>
          <ul className="identity-list">
            {strategyIdentity.communication.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <Flag size={20} />
          <div>
            <span className="eyebrow">7 pilares estratégicos</span>
            <h2>Onde a energia está indo</h2>
          </div>
        </div>
        <div className="pillar-grid">
          {strategicPillars.map((pillar) => (
            <article className="pillar-card" key={pillar.id} style={{ borderLeftColor: pillar.accent }}>
              <div className="pillar-heading">
                <span className="pillar-order">{pillar.order}</span>
                <strong>{pillar.name}</strong>
                <em>{pillar.progress}%</em>
              </div>
              <div className="progress-track" role="progressbar" aria-valuenow={pillar.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progresso do pilar ${pillar.name}`}>
                <span className="progress-fill" style={{ width: `${pillar.progress}%`, backgroundColor: pillar.accent }} />
              </div>
              <p>{pillar.note}</p>
              <span className="pillar-guardian">{pillar.guardian}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <Target size={20} />
          <div>
            <span className="eyebrow">OKRs · T3 2026</span>
            <h2>Objetivos do trimestre</h2>
          </div>
        </div>
        <div className="okr-grid">
          {quarterOkrs.map((okr) => (
            <article className="okr-card" key={okr.objective}>
              <span className="okr-pillar">{okr.pillar}</span>
              <h3>{okr.objective}</h3>
              <div className="okr-results">
                {okr.keyResults.map((result) => (
                  <div className="okr-result" key={result.label}>
                    <div className="okr-result-copy">
                      <span>{result.label}</span>
                      <em>
                        {result.owner} · {result.progress}%
                      </em>
                    </div>
                    <div className="progress-track" role="progressbar" aria-valuenow={result.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progresso: ${result.label}`}>
                      <span className="progress-fill" style={{ width: `${result.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <Flag size={20} />
          <div>
            <span className="eyebrow">Planejamento 2026</span>
            <h2>4 fases do plano</h2>
          </div>
        </div>
        <div className="phase-grid">
          {planPhases.map((phase) => (
            <article
              className={
                phase.status === "Em andamento"
                  ? "phase-card active"
                  : phase.status === "Concluída"
                    ? "phase-card done"
                    : "phase-card"
              }
              key={phase.order}
            >
              <span className="phase-order">Fase {phase.order}</span>
              <strong>{phase.name}</strong>
              <em>{phase.period}</em>
              <p>{phase.summary}</p>
              <span
                className={
                  phase.status === "Concluída"
                    ? "status status-good"
                    : phase.status === "Em andamento"
                      ? "status status-warning"
                      : "status"
                }
              >
                {phase.status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
