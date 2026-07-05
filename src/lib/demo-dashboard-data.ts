import "server-only";

import type { DashboardCompany } from "@/lib/dashboard-types";

export const demoCompanies: DashboardCompany[] = [
  {
    id: "b16",
    name: "Agência B16",
    legalName: "Agência B16 Comunicação Ltda.",
    segment: "Marketing e performance",
    owner: "NoFront Scale",
    status: "Ativa",
    accent: "#0066cc",
    integrations: {
      asaas: "Conectado",
      contaAzul: "Pendente",
    },
    metrics: {
      receita: 84200,
      recebido: 68400,
      aReceber: 22100,
      vencido: 6400,
      aPagar: 31800,
      caixa: 51200,
      resultado: 24300,
      clientes: 18,
      ticket: 4680,
    },
    monthly: [
      { month: "Jan", receita: 61200, recebido: 57400, despesas: 35200 },
      { month: "Fev", receita: 66800, recebido: 60100, despesas: 37300 },
      { month: "Mar", receita: 71400, recebido: 64200, despesas: 40200 },
      { month: "Abr", receita: 76200, recebido: 69800, despesas: 42800 },
      { month: "Mai", receita: 80600, recebido: 73100, despesas: 44100 },
      { month: "Jun", receita: 84200, recebido: 68400, despesas: 45900 },
    ],
    receitas: [
      { name: "Retainer", value: 46200 },
      { name: "Campanhas", value: 25100 },
      { name: "Consultoria", value: 12900 },
    ],
    despesas: [
      { name: "Equipe", value: 21800 },
      { name: "Mídia", value: 13200 },
      { name: "Ferramentas", value: 6100 },
      { name: "Operacional", value: 4800 },
    ],
    receivables: [
      {
        cliente: "Vista Prime",
        descricao: "Mensalidade performance",
        vencimento: "2026-07-08",
        valor: 8200,
        status: "Em dia",
      },
      {
        cliente: "DentoPlus",
        descricao: "Gestão de campanhas",
        vencimento: "2026-07-04",
        valor: 5200,
        status: "Vence hoje",
      },
      {
        cliente: "Lume Store",
        descricao: "Projeto landing page",
        vencimento: "2026-06-28",
        valor: 6400,
        status: "Vencido",
      },
    ],
    payables: [
      {
        cliente: "Meta Ads",
        descricao: "Mídia clientes",
        vencimento: "2026-07-06",
        valor: 13200,
        status: "Agendado",
      },
      {
        cliente: "Equipe criativa",
        descricao: "Prestadores",
        vencimento: "2026-07-10",
        valor: 10400,
        status: "Em dia",
      },
    ],
    alerts: [
      {
        title: "Conta Azul pendente",
        text: "Conectar OAuth2 para conciliar contas a pagar e baixas.",
        tone: "warning",
      },
      {
        title: "Receita em alta",
        text: "Junho cresceu 4,5% contra maio, puxado por retainers.",
        tone: "good",
      },
    ],
  },
  {
    id: "maestro",
    name: "Maestro Tiago Santos",
    legalName: "Tiago Santos Produções Musicais",
    segment: "Educação musical",
    owner: "NoFront Scale",
    status: "Implantação",
    accent: "#1d1d1f",
    integrations: {
      asaas: "Conectado",
      contaAzul: "Conectado",
    },
    metrics: {
      receita: 56300,
      recebido: 49700,
      aReceber: 12100,
      vencido: 2100,
      aPagar: 18400,
      caixa: 36200,
      resultado: 17700,
      clientes: 11,
      ticket: 5118,
    },
    monthly: [
      { month: "Jan", receita: 38200, recebido: 35400, despesas: 21400 },
      { month: "Fev", receita: 42100, recebido: 39800, despesas: 22800 },
      { month: "Mar", receita: 47400, recebido: 43100, despesas: 25400 },
      { month: "Abr", receita: 51200, recebido: 46900, despesas: 27100 },
      { month: "Mai", receita: 53800, recebido: 51200, despesas: 28800 },
      { month: "Jun", receita: 56300, recebido: 49700, despesas: 30200 },
    ],
    receitas: [
      { name: "Mentorias", value: 28600 },
      { name: "Cursos", value: 17400 },
      { name: "Eventos", value: 10300 },
    ],
    despesas: [
      { name: "Equipe", value: 12300 },
      { name: "Plataformas", value: 7200 },
      { name: "Produção", value: 6100 },
      { name: "Administrativo", value: 4600 },
    ],
    receivables: [
      {
        cliente: "Turma Harmonia Pro",
        descricao: "Parcelas recorrentes",
        vencimento: "2026-07-05",
        valor: 6100,
        status: "Em dia",
      },
      {
        cliente: "Workshop Presencial",
        descricao: "Lote patrocinador",
        vencimento: "2026-06-30",
        valor: 2100,
        status: "Vencido",
      },
      {
        cliente: "Mentoria Premium",
        descricao: "Contrato julho",
        vencimento: "2026-07-12",
        valor: 3900,
        status: "Em dia",
      },
    ],
    payables: [
      {
        cliente: "Hotmart",
        descricao: "Taxas e plataforma",
        vencimento: "2026-07-08",
        valor: 7200,
        status: "Agendado",
      },
      {
        cliente: "Estúdio parceiro",
        descricao: "Gravação módulo novo",
        vencimento: "2026-07-14",
        valor: 5400,
        status: "Em dia",
      },
    ],
    alerts: [
      {
        title: "Implantação quase pronta",
        text: "Conta Azul e Asaas conectados; falta validar categorias gerenciais.",
        tone: "good",
      },
      {
        title: "A receber vencido",
        text: "Workshop Presencial concentra R$ 2.100 vencidos.",
        tone: "critical",
      },
    ],
  },
];

export function getDashboardCompaniesForSlugs(slugs: string[] | "all") {
  if (slugs === "all") return demoCompanies;

  const allowed = new Set(slugs);
  return demoCompanies.filter((company) => allowed.has(company.id));
}
