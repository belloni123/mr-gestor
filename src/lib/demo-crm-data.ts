import "server-only";

export type FunnelStage = {
  name: string;
  count: number;
  value: number;
};

export type Opportunity = {
  id: string;
  companySlug: string;
  name: string;
  stage: "Prospecção" | "Qualificação" | "Proposta" | "Negociação" | "Fechamento";
  value: number;
  owner: string;
  nextStep: string;
  expectedClose: string;
};

export type CrmActivity = {
  kind: "Ligação" | "Reunião" | "Proposta" | "Follow-up";
  title: string;
  companySlug: string;
  when: string;
  owner: string;
};

export type MonthlyGoal = {
  month: string;
  meta: number;
  realizado: number;
};

export const funnelStages: FunnelStage[] = [
  { name: "Prospecção", count: 14, value: 96500 },
  { name: "Qualificação", count: 9, value: 71200 },
  { name: "Proposta", count: 6, value: 54800 },
  { name: "Negociação", count: 4, value: 38200 },
  { name: "Fechamento", count: 2, value: 21600 },
];

export const opportunities: Opportunity[] = [
  {
    id: "opp-1",
    companySlug: "b16",
    name: "Vista Prime — expansão de mídia",
    stage: "Negociação",
    value: 12400,
    owner: "Comercial",
    nextStep: "Revisar escopo com o cliente na quinta",
    expectedClose: "2026-07-17",
  },
  {
    id: "opp-2",
    companySlug: "b16",
    name: "Clínica Vitalle — pacote performance",
    stage: "Proposta",
    value: 8900,
    owner: "Comercial",
    nextStep: "Enviar proposta revisada com case",
    expectedClose: "2026-07-24",
  },
  {
    id: "opp-3",
    companySlug: "b16",
    name: "Lume Store — retainer anual",
    stage: "Qualificação",
    value: 15200,
    owner: "Comercial",
    nextStep: "Agendar diagnóstico de funil",
    expectedClose: "2026-08-07",
  },
  {
    id: "opp-4",
    companySlug: "maestro",
    name: "Turma corporativa — coral de empresa",
    stage: "Fechamento",
    value: 9800,
    owner: "Direção",
    nextStep: "Assinatura do contrato e agenda",
    expectedClose: "2026-07-10",
  },
  {
    id: "opp-5",
    companySlug: "maestro",
    name: "Escola Allegro — parceria de aulas",
    stage: "Proposta",
    value: 6400,
    owner: "Direção",
    nextStep: "Apresentar grade de horários",
    expectedClose: "2026-07-28",
  },
  {
    id: "opp-6",
    companySlug: "maestro",
    name: "Mentoria de regência — turma 2",
    stage: "Prospecção",
    value: 5200,
    owner: "Direção",
    nextStep: "Lista de espera aquecida por e-mail",
    expectedClose: "2026-08-20",
  },
];

export const crmActivities: CrmActivity[] = [
  {
    kind: "Reunião",
    title: "Diagnóstico Vista Prime",
    companySlug: "b16",
    when: "Hoje · 14h30",
    owner: "Comercial",
  },
  {
    kind: "Proposta",
    title: "Enviar proposta Clínica Vitalle",
    companySlug: "b16",
    when: "Hoje · 17h00",
    owner: "Comercial",
  },
  {
    kind: "Ligação",
    title: "Follow-up Escola Allegro",
    companySlug: "maestro",
    when: "Amanhã · 10h00",
    owner: "Direção",
  },
  {
    kind: "Follow-up",
    title: "Reaquecer lista da mentoria",
    companySlug: "maestro",
    when: "Sexta · 09h30",
    owner: "Direção",
  },
];

export const monthlyGoals: MonthlyGoal[] = [
  { month: "Fev", meta: 18000, realizado: 15400 },
  { month: "Mar", meta: 18000, realizado: 19800 },
  { month: "Abr", meta: 20000, realizado: 17600 },
  { month: "Mai", meta: 20000, realizado: 21200 },
  { month: "Jun", meta: 22000, realizado: 20400 },
  { month: "Jul", meta: 22000, realizado: 9800 },
];

export const stageOrder = ["Prospecção", "Qualificação", "Proposta", "Negociação", "Fechamento"] as const;

export function stageClass(stage: Opportunity["stage"]) {
  if (stage === "Fechamento") return "status status-good";
  if (stage === "Negociação") return "status status-warning";
  return "status";
}
