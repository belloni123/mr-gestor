import "server-only";

export type MaturityStage = {
  name: string;
  label: string;
  value: number;
};

export type ChannelPerformance = {
  channel: string;
  investimento: number;
  retorno: number;
  leads: number;
};

export type ContentItem = {
  month: string;
  title: string;
  format: "Post" | "Vídeo" | "E-mail" | "Case" | "Landing page";
  status: "Publicado" | "Em produção" | "Planejado";
};

export type MarketingOkr = {
  label: string;
  owner: string;
  progress: number;
};

export const maturityFunnel: MaturityStage[] = [
  { name: "Alcance", label: "Impressões no mês", value: 182000 },
  { name: "Visitantes", label: "Sessões no site", value: 12400 },
  { name: "Leads", label: "Contatos captados", value: 486 },
  { name: "MQL", label: "Leads qualificados por marketing", value: 168 },
  { name: "SQL", label: "Aceitos pelo comercial", value: 54 },
  { name: "Clientes", label: "Novos contratos", value: 11 },
];

export const channelPerformance: ChannelPerformance[] = [
  { channel: "Meta Ads", investimento: 5200, retorno: 14800, leads: 212 },
  { channel: "Google Ads", investimento: 3800, retorno: 11300, leads: 124 },
  { channel: "Orgânico", investimento: 1200, retorno: 8200, leads: 86 },
  { channel: "Indicações", investimento: 400, retorno: 9600, leads: 34 },
  { channel: "E-mail", investimento: 600, retorno: 4100, leads: 30 },
];

export const contentPlan: ContentItem[] = [
  { month: "Julho", title: "Case: controladoria multiempresa na prática", format: "Case", status: "Em produção" },
  { month: "Julho", title: "Série de posts — indicadores que importam", format: "Post", status: "Publicado" },
  { month: "Julho", title: "E-mail mensal para a base de clientes", format: "E-mail", status: "Planejado" },
  { month: "Agosto", title: "Vídeo: rotina de fechamento em 15 minutos", format: "Vídeo", status: "Planejado" },
  { month: "Agosto", title: "Landing page — diagnóstico financeiro", format: "Landing page", status: "Planejado" },
  { month: "Setembro", title: "Case: funil comercial previsível", format: "Case", status: "Planejado" },
];

export const marketingOkrs: MarketingOkr[] = [
  { label: "Gerar 120 leads qualificados no trimestre", owner: "Marketing", progress: 52 },
  { label: "Reduzir CPL médio para R$ 38", owner: "Marketing", progress: 64 },
  { label: "Publicar 2 cases de clientes", owner: "Marketing", progress: 50 },
  { label: "Chegar a 4.0x de ROI consolidado nos canais pagos", owner: "Marketing", progress: 71 },
];

export function contentStatusClass(status: ContentItem["status"]) {
  if (status === "Publicado") return "status status-good";
  if (status === "Em produção") return "status status-warning";
  return "status";
}
