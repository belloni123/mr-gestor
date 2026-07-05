import { Users, WalletCards } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { flattenFinancialItems, statusClass, toBrl } from "@/lib/dashboard-summary";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const { user, companies } = await getProtectedPageContext();
  const receivables = flattenFinancialItems(companies, "receivables");

  return (
    <AppShell
      user={user}
      eyebrow="Clientes"
      title="Carteira e recebiveis"
      subtitle="Leitura inicial de clientes, contratos e contas a receber por empresa autorizada."
    >
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Carteira</span>
          <h1>Clientes com contexto financeiro, nao apenas uma lista.</h1>
          <p>Esta pagina prepara a futura sincronizacao de clientes Asaas e Conta Azul com status de cobranca.</p>
        </div>
      </section>

      <section className="page-card-grid">
        {companies.map((company) => (
          <article className="page-card" key={company.id}>
            <Users size={20} />
            <h2>{company.name}</h2>
            <p>{company.metrics.clientes} clientes ativos em dados demonstrativos.</p>
            <strong>{toBrl(company.metrics.ticket)} ticket medio</strong>
          </article>
        ))}
      </section>

      <section className="table-card">
        <div className="card-heading">
          <div>
            <span className="eyebrow">{receivables.length} registros</span>
            <h2>Recebiveis por cliente</h2>
          </div>
          <WalletCards size={20} />
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Empresa</th>
                <th>Cliente</th>
                <th>Descricao</th>
                <th>Vencimento</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {receivables.map((item) => (
                <tr key={`${item.company}-${item.cliente}-${item.valor}`}>
                  <td>{item.company}</td>
                  <td>{item.cliente}</td>
                  <td>{item.descricao}</td>
                  <td>{new Date(`${item.vencimento}T12:00:00`).toLocaleDateString("pt-BR")}</td>
                  <td>{toBrl(item.valor)}</td>
                  <td><span className={statusClass(item.status)}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
