import { CircleDollarSign, FileChartColumnIncreasing, TrendingDown, TrendingUp, WalletCards } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { flattenFinancialItems, getTotals, statusClass, toBrl, toPercent } from "@/lib/dashboard-summary";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

export default async function ControladoriaPage() {
  const { user, companies } = await getProtectedPageContext();
  const totals = getTotals(companies);
  const receivables = flattenFinancialItems(companies, "receivables");
  const payables = flattenFinancialItems(companies, "payables");

  return (
    <AppShell
      user={user}
      eyebrow="Controladoria"
      title="Centro financeiro"
      subtitle="Visao gerencial de receita, recebimento, despesas, vencidos, margem e proximas acoes."
    >
      <section className="page-hero compact">
        <div>
          <span className="eyebrow">Fechamento gerencial</span>
          <h1>Indicadores para decidir, cobrar e priorizar.</h1>
          <p>
            Esta pagina separa a leitura financeira do dashboard principal e prepara a futura conciliacao com Asaas e Conta
            Azul.
          </p>
        </div>
      </section>

      <section className="kpi-grid">
        <article className="kpi-card">
          <div className="kpi-icon"><TrendingUp size={18} /></div>
          <span>Receita</span>
          <strong>{toBrl(totals.receita)}</strong>
          <em>{toPercent(totals.margem)} de margem</em>
        </article>
        <article className="kpi-card">
          <div className="kpi-icon"><CircleDollarSign size={18} /></div>
          <span>Recebido</span>
          <strong>{toBrl(totals.recebido)}</strong>
          <em>{toPercent((totals.recebido / totals.receita) * 100)} da receita</em>
        </article>
        <article className="kpi-card">
          <div className="kpi-icon"><WalletCards size={18} /></div>
          <span>A receber</span>
          <strong>{toBrl(totals.aReceber)}</strong>
          <em className="warn">{toBrl(totals.vencido)} vencidos</em>
        </article>
        <article className="kpi-card">
          <div className="kpi-icon"><TrendingDown size={18} /></div>
          <span>A pagar</span>
          <strong>{toBrl(totals.aPagar)}</strong>
          <em>{toBrl(totals.caixa)} em caixa demo</em>
        </article>
      </section>

      <section className="page-two-column">
        <article className="page-section">
          <div className="section-heading">
            <FileChartColumnIncreasing size={20} />
            <div>
              <span className="eyebrow">DRE gerencial</span>
              <h2>Resumo consolidado</h2>
            </div>
          </div>
          <div className="statement-list">
            <div><span>Receita bruta</span><strong>{toBrl(totals.receita)}</strong></div>
            <div><span>Recebido</span><strong>{toBrl(totals.recebido)}</strong></div>
            <div><span>Despesas a pagar</span><strong>{toBrl(totals.aPagar)}</strong></div>
            <div><span>Resultado</span><strong>{toBrl(totals.resultado)}</strong></div>
            <div><span>Ticket medio</span><strong>{toBrl(totals.ticket)}</strong></div>
          </div>
        </article>

        <article className="page-section">
          <div className="section-heading">
            <WalletCards size={20} />
            <div>
              <span className="eyebrow">Risco financeiro</span>
              <h2>Fila de atencao</h2>
            </div>
          </div>
          <div className="action-list">
            <span>Priorizar cobrancas vencidas acima de {toBrl(3000)}.</span>
            <span>Validar categorias gerenciais antes da integracao real.</span>
            <span>Separar vencimentos por empresa no fechamento mensal.</span>
          </div>
        </article>
      </section>

      <section className="tables-grid">
        <FinancialMiniTable title="Contas a receber" items={receivables} />
        <FinancialMiniTable title="Contas a pagar" items={payables} />
      </section>
    </AppShell>
  );
}

function FinancialMiniTable({ title, items }: { title: string; items: ReturnType<typeof flattenFinancialItems> }) {
  return (
    <article className="table-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">{items.length} registros</span>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Cliente</th>
              <th>Vencimento</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={`${item.company}-${item.cliente}-${item.valor}`}>
                <td>{item.company}</td>
                <td>{item.cliente}</td>
                <td>{new Date(`${item.vencimento}T12:00:00`).toLocaleDateString("pt-BR")}</td>
                <td>{toBrl(item.valor)}</td>
                <td><span className={statusClass(item.status)}>{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}
