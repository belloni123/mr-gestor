import { CalendarClock, Network, UserCog } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { departments, indicatorClass } from "@/lib/demo-departments-data";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

export default async function DepartmentsPage() {
  const { user } = await getProtectedPageContext();
  const projectCount = departments.reduce((total, department) => total + department.projects.length, 0);

  return (
    <AppShell
      user={user}
      eyebrow="Departamentos"
      title="Times e responsabilidades"
      subtitle="Cada departamento com missão, responsável, indicadores, projetos em andamento e ritual de acompanhamento."
    >
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Organização</span>
          <h1>
            {departments.length} departamentos, {projectCount} projetos em andamento.
          </h1>
          <p>Estrutura enxuta com dono claro: cada indicador tem um time e cada projeto aparece no cronograma.</p>
        </div>
      </section>

      <section className="dept-grid">
        {departments.map((department) => (
          <article className="dept-card" key={department.id} style={{ borderTopColor: department.accent }}>
            <div className="dept-heading">
              <div>
                <h2>{department.name}</h2>
                <p>{department.mission}</p>
              </div>
            </div>

            <div className="dept-meta">
              <span>
                <UserCog size={15} />
                {department.lead}
              </span>
              <span>
                <CalendarClock size={15} />
                {department.ritual}
              </span>
            </div>

            <div className="dept-indicators">
              {department.indicators.map((indicator) => (
                <div className={indicatorClass(indicator.tone)} key={indicator.label}>
                  <strong>{indicator.value}</strong>
                  <span>{indicator.label}</span>
                </div>
              ))}
            </div>

            <div className="dept-projects">
              <span className="eyebrow">Projetos em andamento</span>
              {department.projects.map((project) => (
                <div className="dept-project" key={project.name}>
                  <div className="dept-project-copy">
                    <span>{project.name}</span>
                    <em>{project.progress}%</em>
                  </div>
                  <div className="progress-track" role="progressbar" aria-valuenow={project.progress} aria-valuemin={0} aria-valuemax={100} aria-label={`Progresso: ${project.name}`}>
                    <span
                      className="progress-fill"
                      style={{ width: `${project.progress}%`, backgroundColor: department.accent }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="page-section">
        <div className="section-heading">
          <Network size={20} />
          <div>
            <span className="eyebrow">Como isso se conecta</span>
            <h2>Departamentos, estratégia e cronograma</h2>
          </div>
        </div>
        <div className="action-list">
          <span>Cada projeto de departamento aparece como frente no Cronograma estratégico.</span>
          <span>Os indicadores alimentam os OKRs do trimestre no módulo Estratégia.</span>
          <span>Rituais semanais são o momento oficial de atualizar avanço e alertas.</span>
        </div>
      </section>
    </AppShell>
  );
}
