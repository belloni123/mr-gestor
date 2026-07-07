import "server-only";

export type IdentityBlock = {
  title: string;
  items: string[];
};

export type StrategicPillar = {
  id: string;
  order: string;
  name: string;
  guardian: string;
  progress: number;
  note: string;
  accent: string;
};

export type KeyResult = {
  label: string;
  owner: string;
  progress: number;
};

export type Okr = {
  objective: string;
  pillar: string;
  keyResults: KeyResult[];
};

export type PlanPhase = {
  order: string;
  name: string;
  period: string;
  status: "Concluída" | "Em andamento" | "Planejada";
  summary: string;
};

export type GanttAction = {
  label: string;
  responsible: string;
  startWeek: number;
  endWeek: number;
  progress: number;
};

export type GanttProject = {
  id: string;
  department: string;
  accent: string;
  project: string;
  responsible: string;
  actions: GanttAction[];
};

export const strategyIdentity = {
  mission:
    "Dar às empresas atendidas uma gestão financeira e comercial de nível corporativo, com dados confiáveis, rotina leve e decisões rápidas.",
  vision:
    "Ser o hub que o time e os clientes abrem todos os dias para saber o que aconteceu, o que fazer agora e para onde o negócio está indo.",
  icp: [
    "Empresas de serviços e negócios digitais com faturamento recorrente.",
    "Operações multiempresa que precisam de consolidação e isolamento de dados.",
    "Gestores que decidem por indicadores, não por extrato bancário.",
  ],
  culture: [
    "Dado sem fonte não entra no dashboard.",
    "Toda mudança visível atualiza a Central de Ajuda no mesmo commit.",
    "Segurança não é etapa final: MFA, RBAC e auditoria desde o primeiro dia.",
    "Prometeu no cronograma, aparece no cronograma.",
  ],
  communication: [
    "Assuntos de cliente ficam nos canais oficiais, nunca em grupos pessoais.",
    "Credenciais só entram por cofres e telas seguras — nunca por chat.",
    "Decisões relevantes viram registro em governança, não mensagem solta.",
  ],
};

export const strategicPillars: StrategicPillar[] = [
  {
    id: "operacao",
    order: "01",
    name: "Operação",
    guardian: "Operações & Atendimento",
    progress: 62,
    note: "Rotinas de fechamento e checklists padronizados nas empresas ativas.",
    accent: "#0066cc",
  },
  {
    id: "clientes",
    order: "02",
    name: "Clientes",
    guardian: "Comercial & CRM",
    progress: 48,
    note: "Carteira mapeada; réguas de relacionamento em desenho.",
    accent: "#1d1d1f",
  },
  {
    id: "comercial",
    order: "03",
    name: "Comercial & Marketing",
    guardian: "Comercial & CRM",
    progress: 41,
    note: "Funil unificado no CRM e metas mensais publicadas no hub.",
    accent: "#2997ff",
  },
  {
    id: "financeiro",
    order: "04",
    name: "Financeiro",
    guardian: "Financeiro & Controladoria",
    progress: 74,
    note: "Controladoria consolidada; integrações Asaas e Conta Azul na fila.",
    accent: "#16a34a",
  },
  {
    id: "pessoas",
    order: "05",
    name: "Pessoas & Gestão",
    guardian: "Direção",
    progress: 35,
    note: "Papéis definidos por RBAC; rituais de acompanhamento começando.",
    accent: "#d97706",
  },
  {
    id: "tecnologia",
    order: "06",
    name: "Tecnologia",
    guardian: "Tecnologia & Automação",
    progress: 68,
    note: "Hub em produção com MFA, auditoria e base pronta para conectores.",
    accent: "#7c3aed",
  },
  {
    id: "produto",
    order: "07",
    name: "Produto & Serviço",
    guardian: "Direção",
    progress: 52,
    note: "Catálogo de serviços em revisão para padronizar escopos e preços.",
    accent: "#0ea5e9",
  },
];

export const quarterOkrs: Okr[] = [
  {
    objective: "Fechar o mês com dados confiáveis em todas as empresas",
    pillar: "Financeiro",
    keyResults: [
      { label: "Conciliar 100% dos recebimentos Asaas até o dia 3", owner: "Controladoria", progress: 70 },
      { label: "Reduzir inadimplência consolidada para menos de 8%", owner: "Controladoria", progress: 55 },
      { label: "Publicar DRE gerencial por empresa todo mês", owner: "Controladoria", progress: 80 },
    ],
  },
  {
    objective: "Transformar o funil comercial em máquina previsível",
    pillar: "Comercial & Marketing",
    keyResults: [
      { label: "Manter 30 oportunidades ativas no funil", owner: "Comercial", progress: 60 },
      { label: "Elevar conversão de proposta para 35%", owner: "Comercial", progress: 45 },
      { label: "Gerar 120 leads qualificados no trimestre", owner: "Marketing", progress: 52 },
    ],
  },
  {
    objective: "Operar o hub como fonte única de verdade",
    pillar: "Tecnologia",
    keyResults: [
      { label: "Ativar integração Asaas em produção", owner: "Tecnologia", progress: 25 },
      { label: "Ativar OAuth Conta Azul por empresa", owner: "Tecnologia", progress: 15 },
      { label: "Manter Central de Ajuda 100% sincronizada com o produto", owner: "Todos", progress: 90 },
    ],
  },
];

export const planPhases: PlanPhase[] = [
  {
    order: "1",
    name: "Diagnóstico",
    period: "Mar – Abr 2026",
    status: "Concluída",
    summary: "Mapeamento das empresas, acessos, riscos e fontes de dados.",
  },
  {
    order: "2",
    name: "Estruturação",
    period: "Mai – Jun 2026",
    status: "Concluída",
    summary: "Hub em produção com login seguro, MFA, RBAC e dashboards demo.",
  },
  {
    order: "3",
    name: "Execução",
    period: "Jul – Out 2026",
    status: "Em andamento",
    summary: "Módulos de estratégia, CRM, marketing e departamentos em uso diário.",
  },
  {
    order: "4",
    name: "Escala",
    period: "Nov – Dez 2026",
    status: "Planejada",
    summary: "Integrações Asaas e Conta Azul ativas e novas empresas no portal.",
  },
];

export const ganttMonths = [
  { label: "Jul", weeks: 5 },
  { label: "Ago", weeks: 4 },
  { label: "Set", weeks: 4 },
  { label: "Out", weeks: 5 },
  { label: "Nov", weeks: 4 },
  { label: "Dez", weeks: 4 },
];

export const ganttTotalWeeks = ganttMonths.reduce((total, month) => total + month.weeks, 0);

export const ganttProjects: GanttProject[] = [
  {
    id: "fin",
    department: "Financeiro & Controladoria",
    accent: "#16a34a",
    project: "Fechamento gerencial multiempresa",
    responsible: "Controladoria",
    actions: [
      { label: "Padronizar categorias gerenciais", responsible: "Controladoria", startWeek: 1, endWeek: 4, progress: 80 },
      { label: "Rotina de cobrança de vencidos", responsible: "Controladoria", startWeek: 3, endWeek: 10, progress: 45 },
      { label: "DRE mensal publicado no hub", responsible: "Controladoria", startWeek: 5, endWeek: 26, progress: 30 },
    ],
  },
  {
    id: "crm",
    department: "Comercial & CRM",
    accent: "#0066cc",
    project: "Funil comercial unificado",
    responsible: "Comercial",
    actions: [
      { label: "Migrar oportunidades para o CRM", responsible: "Comercial", startWeek: 1, endWeek: 3, progress: 100 },
      { label: "Régua de follow-up semanal", responsible: "Comercial", startWeek: 3, endWeek: 12, progress: 50 },
      { label: "Metas mensais revisadas no hub", responsible: "Comercial", startWeek: 6, endWeek: 26, progress: 25 },
    ],
  },
  {
    id: "mkt",
    department: "Marketing & Conteúdo",
    accent: "#d97706",
    project: "Máquina de geração de demanda",
    responsible: "Marketing",
    actions: [
      { label: "Calendário editorial do trimestre", responsible: "Marketing", startWeek: 1, endWeek: 4, progress: 90 },
      { label: "Campanhas Meta e Google otimizadas", responsible: "Marketing", startWeek: 2, endWeek: 14, progress: 40 },
      { label: "Relatório mensal de canais", responsible: "Marketing", startWeek: 5, endWeek: 26, progress: 20 },
    ],
  },
  {
    id: "ops",
    department: "Operações & Atendimento",
    accent: "#7c3aed",
    project: "Rotina operacional padronizada",
    responsible: "Operações",
    actions: [
      { label: "Checklist de onboarding de empresa", responsible: "Operações", startWeek: 2, endWeek: 6, progress: 65 },
      { label: "SLA de atendimento e suporte", responsible: "Operações", startWeek: 4, endWeek: 9, progress: 35 },
      { label: "Rituais semanais por departamento", responsible: "Operações", startWeek: 6, endWeek: 26, progress: 30 },
    ],
  },
  {
    id: "tec",
    department: "Tecnologia & Automação",
    accent: "#0ea5e9",
    project: "Integrações e automações",
    responsible: "Tecnologia",
    actions: [
      { label: "Credenciais seguras por empresa", responsible: "Tecnologia", startWeek: 3, endWeek: 7, progress: 20 },
      { label: "Webhooks Asaas em sandbox", responsible: "Tecnologia", startWeek: 6, endWeek: 12, progress: 10 },
      { label: "OAuth Conta Azul + sincronização", responsible: "Tecnologia", startWeek: 10, endWeek: 20, progress: 0 },
    ],
  },
];
