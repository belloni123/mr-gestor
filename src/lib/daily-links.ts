import "server-only";

export type QuickLink = {
  label: string;
  description: string;
  href: string;
  external: boolean;
};

export const externalQuickLinks: QuickLink[] = [
  {
    label: "WhatsApp",
    description: "Atendimento e follow-ups do dia",
    href: "https://web.whatsapp.com",
    external: true,
  },
  {
    label: "E-mail",
    description: "Caixa de entrada da operação",
    href: "https://mail.google.com",
    external: true,
  },
  {
    label: "Agenda",
    description: "Reuniões e compromissos",
    href: "https://calendar.google.com",
    external: true,
  },
  {
    label: "Conta Azul",
    description: "ERP financeiro das empresas",
    href: "https://login.contaazul.com",
    external: true,
  },
  {
    label: "Asaas",
    description: "Cobranças e recebimentos",
    href: "https://www.asaas.com/login",
    external: true,
  },
];

export const internalQuickLinks: QuickLink[] = [
  {
    label: "Controladoria",
    description: "Fechamento e fila de risco",
    href: "/controladoria",
    external: false,
  },
  {
    label: "CRM & Vendas",
    description: "Funil e próximos passos",
    href: "/crm",
    external: false,
  },
  {
    label: "Cronograma",
    description: "Semana a semana por departamento",
    href: "/roadmap",
    external: false,
  },
  {
    label: "Central de Ajuda",
    description: "Guias e novidades do hub",
    href: "/help",
    external: false,
  },
];
