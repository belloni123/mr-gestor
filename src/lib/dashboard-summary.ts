import type { DashboardCompany, FinancialItem } from "@/lib/dashboard-types";

export const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

export function toBrl(value: number) {
  return brl.format(value);
}

export function toPercent(value: number) {
  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

export function sumBy<T>(items: T[], selector: (item: T) => number) {
  return items.reduce((total, item) => total + selector(item), 0);
}

export function getTotals(companies: DashboardCompany[]) {
  const receita = sumBy(companies, (company) => company.metrics.receita);
  const recebido = sumBy(companies, (company) => company.metrics.recebido);
  const aReceber = sumBy(companies, (company) => company.metrics.aReceber);
  const vencido = sumBy(companies, (company) => company.metrics.vencido);
  const aPagar = sumBy(companies, (company) => company.metrics.aPagar);
  const caixa = sumBy(companies, (company) => company.metrics.caixa);
  const resultado = sumBy(companies, (company) => company.metrics.resultado);
  const clientes = sumBy(companies, (company) => company.metrics.clientes);

  return {
    receita,
    recebido,
    aReceber,
    vencido,
    aPagar,
    caixa,
    resultado,
    clientes,
    ticket: clientes ? receita / clientes : 0,
    inadimplencia: aReceber + vencido ? (vencido / (aReceber + vencido)) * 100 : 0,
    margem: receita ? (resultado / receita) * 100 : 0,
  };
}

export function flattenFinancialItems(companies: DashboardCompany[], key: "receivables" | "payables") {
  return companies.flatMap((company) => company[key].map((item) => ({ ...item, company: company.name })));
}

export function statusClass(status: FinancialItem["status"]) {
  if (status === "Vencido") return "status status-danger";
  if (status === "Vence hoje") return "status status-warning";
  if (status === "Pago") return "status status-good";
  return "status";
}
