import { CalendarRange, Flag } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import {
  ganttMonths,
  ganttProjects,
  ganttTotalWeeks,
  planPhases,
} from "@/lib/demo-strategy-data";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

export default async function RoadmapPage() {
  const { user } = await getProtectedPageContext();
  const actionsCount = ganttProjects.reduce((total, project) => total + project.actions.length, 0);

  return (
    <AppShell
      user={user}
      eyebrow="Cronograma"
      title="Cronograma estratégico"
      subtitle="Execução semana a semana, por departamento, de julho a dezembro de 2026 — com responsável e avanço."
    >
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Jul – Dez 2026 · por semana</span>
          <h1>O plano vira agenda: {ganttProjects.length} frentes, {actionsCount} ações.</h1>
          <p>Cada barra mostra início, fim e percentual concluído. Atualize o avanço nas reuniões semanais.</p>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <Flag size={20} />
          <div>
            <span className="eyebrow">Fases</span>
            <h2>Onde estamos no plano</h2>
          </div>
        </div>
        <div className="phase-strip">
          {planPhases.map((phase) => (
            <div
              className={
                phase.status === "Em andamento"
                  ? "phase-step active"
                  : phase.status === "Concluída"
                    ? "phase-step done"
                    : "phase-step"
              }
              key={phase.order}
            >
              <span className="phase-dot" />
              <strong>
                Fase {phase.order} · {phase.name}
              </strong>
              <em>{phase.period}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <CalendarRange size={20} />
          <div>
            <span className="eyebrow">Gantt semanal</span>
            <h2>Execução por departamento</h2>
          </div>
        </div>

        <div className="gantt-scroll">
          <div className="gantt" style={{ ["--gantt-weeks" as string]: ganttTotalWeeks }}>
            <div className="gantt-header">
              <div className="gantt-side">Frente / ação</div>
              <div className="gantt-months">
                {ganttMonths.map((month) => (
                  <span key={month.label} style={{ ["--month-weeks" as string]: month.weeks }}>
                    {month.label}
                  </span>
                ))}
              </div>
            </div>

            {ganttProjects.map((project) => (
              <div className="gantt-group" key={project.id}>
                <div className="gantt-project-row">
                  <div className="gantt-side">
                    <span className="gantt-dept" style={{ color: project.accent }}>
                      {project.department}
                    </span>
                    <strong>{project.project}</strong>
                    <em>{project.responsible}</em>
                  </div>
                  <div className="gantt-lane" aria-hidden />
                </div>
                {project.actions.map((action) => (
                  <div className="gantt-action-row" key={action.label}>
                    <div className="gantt-side">
                      <span className="gantt-action-label">{action.label}</span>
                      <em>
                        {action.responsible} · {action.progress}%
                      </em>
                    </div>
                    <div className="gantt-lane">
                      <div
                        className="gantt-bar"
                        style={{
                          ["--bar-start" as string]: action.startWeek,
                          ["--bar-span" as string]: action.endWeek - action.startWeek + 1,
                          backgroundColor: `${project.accent}26`,
                          borderColor: project.accent,
                        }}
                        title={`${action.label} — semanas ${action.startWeek} a ${action.endWeek} · ${action.progress}% concluído`}
                      >
                        <span
                          className="gantt-bar-fill"
                          style={{ width: `${action.progress}%`, backgroundColor: project.accent }}
                        />
                        <span className="gantt-bar-pct">{action.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="gantt-note">
          Arraste lateralmente para ver o semestre inteiro. Os dados são demonstrativos até o plano oficial ser carregado.
        </p>
      </section>
    </AppShell>
  );
}
