import "server-only";

export type DepartmentIndicator = {
  label: string;
  value: string;
  tone: "ok" | "warn" | "good";
};

export type DepartmentProject = {
  name: string;
  progress: number;
};

export type Department = {
  id: string;
  name: string;
  lead: string;
  mission: string;
  ritual: string;
  accent: string;
  indicators: DepartmentIndicator[];
  projects: DepartmentProject[];
};

export const departments: Department[] = [
  {
    id: "financeiro",
    name: "Financeiro & Controladoria",
    lead: "Controladoria",
    mission: "Fechar o mês com dados confiáveis e cobrança em dia em todas as empresas.",
    ritual: "Fechamento gerencial — toda segunda, 9h",
    accent: "#16a34a",
    indicators: [
      { label: "Inadimplência consolidada", value: "9,4%", tone: "warn" },
      { label: "Margem gerencial", value: "29,9%", tone: "good" },
      { label: "Contas conciliadas", value: "82%", tone: "ok" },
    ],
    projects: [
      { name: "Padronização de categorias gerenciais", progress: 80 },
      { name: "Rotina de cobrança de vencidos", progress: 45 },
    ],
  },
  {
    id: "comercial",
    name: "Comercial & CRM",
    lead: "Comercial",
    mission: "Manter o funil previsível e transformar oportunidades em contratos.",
    ritual: "Revisão de pipeline — toda terça, 10h",
    accent: "#0066cc",
    indicators: [
      { label: "Pipeline aberto", value: "R$ 58 mil", tone: "good" },
      { label: "Conversão em proposta", value: "31%", tone: "ok" },
      { label: "Oportunidades ativas", value: "6", tone: "ok" },
    ],
    projects: [
      { name: "Régua de follow-up semanal", progress: 50 },
      { name: "Metas mensais publicadas no hub", progress: 25 },
    ],
  },
  {
    id: "marketing",
    name: "Marketing & Conteúdo",
    lead: "Marketing",
    mission: "Gerar demanda qualificada e sustentar a autoridade das marcas atendidas.",
    ritual: "Sprint de conteúdo — toda quarta, 14h",
    accent: "#d97706",
    indicators: [
      { label: "Leads no mês", value: "486", tone: "good" },
      { label: "CPL médio", value: "R$ 41", tone: "ok" },
      { label: "ROI canais pagos", value: "3,4x", tone: "good" },
    ],
    projects: [
      { name: "Calendário editorial do trimestre", progress: 90 },
      { name: "Otimização de campanhas pagas", progress: 40 },
    ],
  },
  {
    id: "operacoes",
    name: "Operações & Atendimento",
    lead: "Operações",
    mission: "Padronizar rotinas, onboarding e atendimento para escalar sem perder qualidade.",
    ritual: "Ritual de operação — toda quinta, 9h30",
    accent: "#7c3aed",
    indicators: [
      { label: "Onboarding padronizado", value: "65%", tone: "ok" },
      { label: "SLA de resposta", value: "4h úteis", tone: "ok" },
      { label: "Rituais ativos", value: "4 de 5", tone: "good" },
    ],
    projects: [
      { name: "Checklist de onboarding de empresa", progress: 65 },
      { name: "SLA de atendimento e suporte", progress: 35 },
    ],
  },
  {
    id: "tecnologia",
    name: "Tecnologia & Automação",
    lead: "Tecnologia",
    mission: "Manter o hub seguro, rápido e pronto para as integrações Asaas e Conta Azul.",
    ritual: "Revisão técnica — toda sexta, 11h",
    accent: "#0ea5e9",
    indicators: [
      { label: "Uptime do hub", value: "99,9%", tone: "good" },
      { label: "Integrações ativas", value: "0 de 2", tone: "warn" },
      { label: "Cobertura de auditoria", value: "100%", tone: "good" },
    ],
    projects: [
      { name: "Credenciais seguras por empresa", progress: 20 },
      { name: "Webhooks Asaas em sandbox", progress: 10 },
    ],
  },
];

export function indicatorClass(tone: DepartmentIndicator["tone"]) {
  if (tone === "warn") return "dept-indicator warn";
  if (tone === "good") return "dept-indicator good";
  return "dept-indicator";
}
