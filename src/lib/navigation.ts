import {
  BookOpen,
  Building2,
  CalendarCheck2,
  CalendarRange,
  DatabaseZap,
  FileChartColumnIncreasing,
  Handshake,
  LayoutDashboard,
  Megaphone,
  Network,
  Settings,
  ShieldCheck,
  Target,
  UserCog,
  Users,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  description: string;
  superAdminOnly?: boolean;
};

export type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Uso diário",
    items: [
      {
        label: "Meu dia",
        href: "/daily",
        icon: CalendarCheck2,
        description: "Prioridades, agenda, atalhos e alertas do dia.",
      },
      {
        label: "Dashboards",
        href: "/",
        icon: LayoutDashboard,
        description: "Indicadores consolidados e por empresa.",
      },
      {
        label: "Controladoria",
        href: "/controladoria",
        icon: FileChartColumnIncreasing,
        description: "Fechamento gerencial, DRE e fila de risco.",
      },
      {
        label: "Ajuda",
        href: "/help",
        icon: BookOpen,
        description: "Central de Ajuda e novidades do produto.",
      },
    ],
  },
  {
    label: "Estratégia",
    items: [
      {
        label: "Estratégia",
        href: "/strategy",
        icon: Target,
        description: "Identidade, pilares, OKRs e fases do plano.",
      },
      {
        label: "Cronograma",
        href: "/roadmap",
        icon: CalendarRange,
        description: "Plano de execução semanal por departamento.",
      },
      {
        label: "Departamentos",
        href: "/departments",
        icon: Network,
        description: "Times, responsáveis, indicadores e projetos.",
      },
    ],
  },
  {
    label: "CRM & Marketing",
    items: [
      {
        label: "CRM & Vendas",
        href: "/crm",
        icon: Handshake,
        description: "Funil comercial, oportunidades e metas.",
      },
      {
        label: "Marketing",
        href: "/marketing",
        icon: Megaphone,
        description: "Funil de maturidade, canais e conteúdo.",
      },
      {
        label: "Clientes",
        href: "/clients",
        icon: Users,
        description: "Carteira, recebíveis e contexto financeiro.",
      },
    ],
  },
  {
    label: "Organização",
    items: [
      {
        label: "Empresas",
        href: "/companies",
        icon: Building2,
        description: "Base multiempresa e permissões de acesso.",
      },
      {
        label: "Integrações",
        href: "/integrations",
        icon: DatabaseZap,
        description: "Status Asaas e Conta Azul por empresa.",
      },
      {
        label: "Governança",
        href: "/governance",
        icon: ShieldCheck,
        description: "Segurança, RBAC e trilha de auditoria.",
      },
      {
        label: "Usuários",
        href: "/admin/users",
        icon: UserCog,
        description: "Administração de usuários e permissões.",
        superAdminOnly: true,
      },
      {
        label: "Ajustes",
        href: "/settings",
        icon: Settings,
        description: "Central administrativa e minha segurança.",
      },
    ],
  },
];

export const topLinks = [
  { label: "Meu dia", href: "/daily" },
  { label: "Dashboards", href: "/" },
  { label: "Estratégia", href: "/strategy" },
  { label: "CRM", href: "/crm" },
  { label: "Marketing", href: "/marketing" },
  { label: "Ajuda", href: "/help" },
];

export function flattenNavigation(isSuperAdmin: boolean): NavigationItem[] {
  return navigationGroups
    .flatMap((group) => group.items)
    .filter((item) => !item.superAdminOnly || isSuperAdmin);
}

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
