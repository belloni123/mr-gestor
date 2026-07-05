import { AuditAction } from "@prisma/client";
import { Activity, LockKeyhole, ShieldCheck, UserCog } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { getPrisma } from "@/lib/prisma";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

export default async function GovernancePage() {
  const { user } = await getProtectedPageContext();
  const auditLogs = await getAuditLogs(user.role === "SUPER_ADMIN");

  return (
    <AppShell
      user={user}
      eyebrow="Governança"
      title="Segurança e auditoria"
      subtitle="Controles de acesso, MFA, eventos sensíveis e trilha operacional para manter o portal sigiloso."
    >
      <section className="page-card-grid">
        <article className="page-card">
          <ShieldCheck size={20} />
          <h2>MFA obrigatório</h2>
          <p>Todo usuário passa por dupla autenticação antes de acessar dados das empresas.</p>
        </article>
        <article className="page-card">
          <LockKeyhole size={20} />
          <h2>Isolamento por empresa</h2>
          <p>Editor recebe apenas empresas vinculadas. Super admin visualiza tudo.</p>
        </article>
        <article className="page-card">
          <UserCog size={20} />
          <h2>RBAC</h2>
          <p>Super admin gerencia usuários, senhas e permissões. Editor altera apenas a própria senha.</p>
        </article>
        <article className="page-card">
          <Activity size={20} />
          <h2>Auditoria</h2>
          <p>Eventos sensíveis são registrados para revisão operacional.</p>
        </article>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <Activity size={20} />
          <div>
            <span className="eyebrow">Eventos recentes</span>
            <h2>Trilha de auditoria</h2>
          </div>
        </div>
        {user.role === "SUPER_ADMIN" ? (
          <div className="audit-list">
            {auditLogs.map((log) => (
              <article className="audit-row" key={log.id}>
                <span>{formatAuditAction(log.action)}</span>
                <strong>{log.message}</strong>
                <p>{log.user?.name ?? log.user?.email ?? "Sistema"} - {log.createdAt.toLocaleString("pt-BR")}</p>
              </article>
            ))}
            {!auditLogs.length ? <div className="empty-state">Sem eventos recentes.</div> : null}
          </div>
        ) : (
          <div className="security-notice">A trilha completa de auditoria é visível apenas para super admin.</div>
        )}
      </section>
    </AppShell>
  );
}

async function getAuditLogs(canReadAudit: boolean) {
  if (!canReadAudit || !process.env.DATABASE_URL) return [];

  try {
    return await getPrisma().auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true, email: true } } },
    });
  } catch {
    return [];
  }
}

function formatAuditAction(action: AuditAction) {
  return action.replaceAll("_", " ").toLowerCase();
}
