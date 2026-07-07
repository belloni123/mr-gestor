import { ArrowUpRight, CalendarDays, Link2, ListTodo } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { DailyHero } from "@/components/daily/daily-hero";
import { DailyPriorities } from "@/components/daily/daily-priorities";
import { MiniCalendar } from "@/components/daily/mini-calendar";
import { externalQuickLinks, internalQuickLinks } from "@/lib/daily-links";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

export default async function DailyPage() {
  const { user, companies } = await getProtectedPageContext();
  const alerts = companies.flatMap((company) =>
    company.alerts.map((alert) => ({ ...alert, company: company.name })),
  );

  return (
    <AppShell
      user={user}
      eyebrow="Meu dia"
      title="Uso diário"
      subtitle="A primeira tela do dia: prioridades, atalhos de trabalho, calendário e alertas das empresas."
    >
      <section className="daily-hero-row">
        <DailyHero name={user.name} />
        <MiniCalendar />
      </section>

      <section className="daily-grid">
        <DailyPriorities userId={user.id} />

        <div className="daily-side">
          <article className="page-section">
            <div className="section-heading">
              <Link2 size={20} />
              <div>
                <span className="eyebrow">Atalhos externos</span>
                <h2>Ferramentas do dia</h2>
              </div>
            </div>
            <div className="quick-link-grid">
              {externalQuickLinks.map((link) => (
                <a
                  className="quick-link-card"
                  href={link.href}
                  key={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <strong>
                    {link.label}
                    <ArrowUpRight size={14} />
                  </strong>
                  <span>{link.description}</span>
                </a>
              ))}
            </div>
          </article>

          <article className="page-section">
            <div className="section-heading">
              <ListTodo size={20} />
              <div>
                <span className="eyebrow">Atalhos internos</span>
                <h2>Dentro do hub</h2>
              </div>
            </div>
            <div className="quick-link-grid">
              {internalQuickLinks.map((link) => (
                <a className="quick-link-card internal" href={link.href} key={link.href}>
                  <strong>{link.label}</strong>
                  <span>{link.description}</span>
                </a>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <CalendarDays size={20} />
          <div>
            <span className="eyebrow">Alertas das empresas</span>
            <h2>O que precisa da sua atenção</h2>
          </div>
        </div>
        <div className="daily-alerts">
          {alerts.map((alert) => (
            <article
              className={
                alert.tone === "critical"
                  ? "alert alert-critical"
                  : alert.tone === "warning"
                    ? "alert alert-warning"
                    : "alert alert-good"
              }
              key={`${alert.company}-${alert.title}`}
            >
              <strong>{alert.title}</strong>
              <p>{alert.text}</p>
              <span>{alert.company}</span>
            </article>
          ))}
          {!alerts.length ? <div className="empty-state">Sem alertas nas empresas autorizadas.</div> : null}
        </div>
      </section>
    </AppShell>
  );
}
