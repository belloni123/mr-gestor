"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  DatabaseZap,
  FileChartColumnIncreasing,
  Filter,
  LayoutDashboard,
  LockKeyhole,
  Menu,
  PieChart as PieChartIcon,
  RefreshCcw,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
  WalletCards,
  X,
} from "lucide-react";

type MonthlyPoint = {
  month: string;
  receita: number;
  recebido: number;
  despesas: number;
};

type Slice = {
  name: string;
  value: number;
};

type FinancialItem = {
  cliente: string;
  descricao: string;
  vencimento: string;
  valor: number;
  status: "Em dia" | "Vence hoje" | "Vencido" | "Pago" | "Agendado";
};

type Alert = {
  title: string;
  text: string;
  tone: "critical" | "warning" | "good";
};

type Company = {
  id: string;
  name: string;
  legalName: string;
  segment: string;
  owner: string;
  status: "Ativa" | "Implantacao";
  accent: string;
  integrations: {
    asaas: "Conectado" | "Pendente";
    contaAzul: "Conectado" | "Pendente";
  };
  metrics: {
    receita: number;
    recebido: number;
    aReceber: number;
    vencido: number;
    aPagar: number;
    caixa: number;
    resultado: number;
    clientes: number;
    ticket: number;
  };
  monthly: MonthlyPoint[];
  receitas: Slice[];
  despesas: Slice[];
  receivables: FinancialItem[];
  payables: FinancialItem[];
  alerts: Alert[];
};

type DashboardView = "executivo" | "controladoria" | "receber" | "pagar";

const companies: Company[] = [
  {
    id: "b16",
    name: "Agencia B16",
    legalName: "Agencia B16 Comunicacao Ltda.",
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
      { name: "Midia", value: 13200 },
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
        descricao: "Gestao de campanhas",
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
        descricao: "Midia clientes",
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
    legalName: "Tiago Santos Producoes Musicais",
    segment: "Educacao musical",
    owner: "NoFront Scale",
    status: "Implantacao",
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
      { name: "Producao", value: 6100 },
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
        cliente: "Estudio parceiro",
        descricao: "Gravacao modulo novo",
        vencimento: "2026-07-14",
        valor: 5400,
        status: "Em dia",
      },
    ],
    alerts: [
      {
        title: "Implantacao quase pronta",
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

const moduleItems = [
  { label: "Dashboards", icon: LayoutDashboard },
  { label: "Controladoria", icon: FileChartColumnIncreasing },
  { label: "Empresas", icon: Building2 },
  { label: "Clientes", icon: Users },
  { label: "Integracoes", icon: DatabaseZap },
  { label: "Governanca", icon: ShieldCheck },
  { label: "Acessos", icon: LockKeyhole },
];

const views: { id: DashboardView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "executivo", label: "Executivo", icon: LayoutDashboard },
  { id: "controladoria", label: "Controladoria", icon: FileChartColumnIncreasing },
  { id: "receber", label: "Receber", icon: CircleDollarSign },
  { id: "pagar", label: "Pagar", icon: WalletCards },
];

const pieColors = ["#0066cc", "#1d1d1f", "#7a7a7a", "#2997ff", "#cccccc"];

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const compact = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

function toBrl(value: number) {
  return brl.format(value);
}

function toCompactBrl(value: number) {
  return `R$ ${compact.format(value)}`;
}

function toPercent(value: number) {
  return `${value.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;
}

function sumBy<T>(items: T[], selector: (item: T) => number) {
  return items.reduce((total, item) => total + selector(item), 0);
}

function mergeSlices(items: Company[], key: "receitas" | "despesas") {
  const map = new Map<string, number>();
  items.forEach((company) => {
    company[key].forEach((slice) => {
      map.set(slice.name, (map.get(slice.name) ?? 0) + slice.value);
    });
  });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

function mergeMonthly(items: Company[]) {
  const months = companies[0]?.monthly.map((point) => point.month) ?? [];
  return months.map((month, index) => ({
    month,
    receita: sumBy(items, (company) => company.monthly[index]?.receita ?? 0),
    recebido: sumBy(items, (company) => company.monthly[index]?.recebido ?? 0),
    despesas: sumBy(items, (company) => company.monthly[index]?.despesas ?? 0),
  }));
}

function statusClass(status: FinancialItem["status"]) {
  if (status === "Vencido") return "status status-danger";
  if (status === "Vence hoje") return "status status-warning";
  if (status === "Pago") return "status status-good";
  return "status";
}

function alertClass(tone: Alert["tone"]) {
  if (tone === "critical") return "alert alert-critical";
  if (tone === "warning") return "alert alert-warning";
  return "alert alert-good";
}

export function MrGestorApp() {
  const [selectedIds, setSelectedIds] = useState<string[]>(companies.map((company) => company.id));
  const [view, setView] = useState<DashboardView>("executivo");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const selectedCompanies = useMemo(() => {
    const filtered = companies.filter((company) => selectedIds.includes(company.id));
    return filtered.length ? filtered : companies;
  }, [selectedIds]);

  const totals = useMemo(() => {
    const receita = sumBy(selectedCompanies, (company) => company.metrics.receita);
    const recebido = sumBy(selectedCompanies, (company) => company.metrics.recebido);
    const aReceber = sumBy(selectedCompanies, (company) => company.metrics.aReceber);
    const vencido = sumBy(selectedCompanies, (company) => company.metrics.vencido);
    const aPagar = sumBy(selectedCompanies, (company) => company.metrics.aPagar);
    const caixa = sumBy(selectedCompanies, (company) => company.metrics.caixa);
    const resultado = sumBy(selectedCompanies, (company) => company.metrics.resultado);
    const clientes = sumBy(selectedCompanies, (company) => company.metrics.clientes);
    const ticket = clientes ? receita / clientes : 0;
    const inadimplencia = aReceber + vencido ? (vencido / (aReceber + vencido)) * 100 : 0;
    const margem = receita ? (resultado / receita) * 100 : 0;

    return {
      receita,
      recebido,
      aReceber,
      vencido,
      aPagar,
      caixa,
      resultado,
      clientes,
      ticket,
      inadimplencia,
      margem,
    };
  }, [selectedCompanies]);

  const monthly = useMemo(() => mergeMonthly(selectedCompanies), [selectedCompanies]);
  const receitas = useMemo(() => mergeSlices(selectedCompanies, "receitas"), [selectedCompanies]);
  const despesas = useMemo(() => mergeSlices(selectedCompanies, "despesas"), [selectedCompanies]);
  const receivables = useMemo(
    () => selectedCompanies.flatMap((company) => company.receivables.map((item) => ({ ...item, company: company.name }))),
    [selectedCompanies],
  );
  const payables = useMemo(
    () => selectedCompanies.flatMap((company) => company.payables.map((item) => ({ ...item, company: company.name }))),
    [selectedCompanies],
  );
  const alerts = useMemo(
    () => selectedCompanies.flatMap((company) => company.alerts.map((alert) => ({ ...alert, company: company.name }))),
    [selectedCompanies],
  );

  function toggleCompany(companyId: string) {
    setSelectedIds((current) => {
      if (current.includes(companyId)) {
        const next = current.filter((id) => id !== companyId);
        return next.length ? next : current;
      }
      return [...current, companyId];
    });
  }

  function selectAllCompanies() {
    setSelectedIds(companies.map((company) => company.id));
  }

  function selectOnly(companyId: string) {
    setSelectedIds([companyId]);
  }

  const selectedLabel =
    selectedCompanies.length === companies.length
      ? "Todas as empresas"
      : selectedCompanies.map((company) => company.name).join(" + ");

  return (
    <div className="mr-app">
      <header className="global-nav">
        <div className="global-nav-inner">
          <a className="brand-mark" href="#top" aria-label="MR Gestor inicio">
            MR Gestor
          </a>
          <nav className="global-links" aria-label="Navegacao principal">
            <a href="#dashboards">Dashboards</a>
            <a href="#controladoria">Controladoria</a>
            <a href="#empresas">Empresas</a>
            <a href="#integracoes">Integracoes</a>
          </nav>
          <div className="nav-actions">
            <button className="icon-button" aria-label="Buscar">
              <Search size={17} />
            </button>
            <button className="icon-button" aria-label="Notificacoes">
              <Bell size={17} />
            </button>
            <button className="menu-button" aria-label="Abrir menu">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="sub-nav" id="top">
        <div className="sub-nav-inner">
          <div className="context-title">
            <span>Controladoria</span>
            <strong>{selectedLabel}</strong>
          </div>
          <div className="sub-nav-actions">
            <button className="filter-trigger" onClick={() => setFiltersOpen(true)} type="button">
              <Filter size={16} />
              Filtros
            </button>
            <div className="period-pill">
              Jul 2026
              <ChevronDown size={15} />
            </div>
            <button className="primary-pill" type="button">
              <RefreshCcw size={15} />
              Sincronizar
            </button>
          </div>
        </div>
      </div>

      <main className="app-shell">
        <aside className="left-rail" aria-label="Modulos">
          {moduleItems.map((item) => {
            const Icon = item.icon;
            return (
              <button className="rail-item" key={item.label} type="button" title={item.label}>
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        <section className="workspace" id="dashboards">
          <section className="hero-tile" aria-labelledby="hero-title">
            <div className="hero-copy">
              <span className="eyebrow">Uso interno e portal do cliente</span>
              <h1 id="hero-title">MR Gestor</h1>
              <p>
                {selectedCompanies.length} empresa{selectedCompanies.length > 1 ? "s" : ""} em contexto.
              </p>
            </div>
            <div className="hero-metrics">
              <MetricMini label="Receita" value={toCompactBrl(totals.receita)} />
              <MetricMini label="Resultado" value={toCompactBrl(totals.resultado)} />
              <MetricMini label="Inadimplencia" value={toPercent(totals.inadimplencia)} />
            </div>
          </section>

          <section className="company-filter-bar" aria-label="Selecao de empresas">
            <div className="filter-label">Empresas</div>
            <div className="company-chips">
              {companies.map((company) => {
                const active = selectedIds.includes(company.id);
                return (
                  <button
                    className={active ? "company-chip active" : "company-chip"}
                    key={company.id}
                    onClick={() => toggleCompany(company.id)}
                    type="button"
                    aria-pressed={active}
                  >
                    <span className="chip-check">{active ? <Check size={13} /> : null}</span>
                    {company.name}
                  </button>
                );
              })}
            </div>
            <button className="text-action" onClick={selectAllCompanies} type="button">
              Todas
            </button>
          </section>

          <section className="view-tabs" aria-label="Visoes do dashboard">
            {views.map((item) => {
              const Icon = item.icon;
              const active = item.id === view;
              return (
                <button
                  className={active ? "view-tab active" : "view-tab"}
                  key={item.id}
                  onClick={() => setView(item.id)}
                  type="button"
                  aria-pressed={active}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </section>

          <section className="kpi-grid" aria-label="Indicadores principais">
            <KpiCard icon={TrendingUp} label="Receita do periodo" value={toBrl(totals.receita)} delta="+5,1% vs mes anterior" />
            <KpiCard icon={CircleDollarSign} label="Recebido" value={toBrl(totals.recebido)} delta={`${toPercent((totals.recebido / totals.receita) * 100)} da receita`} />
            <KpiCard icon={WalletCards} label="A receber" value={toBrl(totals.aReceber)} delta={`${toBrl(totals.vencido)} vencidos`} tone={totals.vencido > 5000 ? "warn" : "ok"} />
            <KpiCard icon={PieChartIcon} label="Margem gerencial" value={toPercent(totals.margem)} delta={`${toBrl(totals.resultado)} de resultado`} />
          </section>

          <section className="analytics-grid" id="controladoria">
            <article className="chart-card wide">
              <div className="card-heading">
                <div>
                  <span className="eyebrow">Fluxo financeiro</span>
                  <h2>Receita, recebido e despesas</h2>
                </div>
                <span className="data-source">Asaas + Conta Azul</span>
              </div>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthly} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="none" x1="0" x2="0" y1="0" y2="1" />
                    </defs>
                    <CartesianGrid stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#7a7a7a", fontSize: 12 }} />
                    <YAxis hide domain={[0, "dataMax + 16000"]} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area dataKey="receita" type="monotone" stroke="#0066cc" strokeWidth={3} fill="#0066cc" fillOpacity={0.08} />
                    <Area dataKey="recebido" type="monotone" stroke="#1d1d1f" strokeWidth={3} fill="#1d1d1f" fillOpacity={0.05} />
                    <Area dataKey="despesas" type="monotone" stroke="#7a7a7a" strokeWidth={2} fill="#7a7a7a" fillOpacity={0.04} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </article>

            <article className="chart-card">
              <div className="card-heading">
                <div>
                  <span className="eyebrow">Composicao</span>
                  <h2>{view === "pagar" ? "Despesas" : "Receitas"}</h2>
                </div>
              </div>
              <div className="donut-layout">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={view === "pagar" ? despesas : receitas}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={86}
                      paddingAngle={3}
                    >
                      {(view === "pagar" ? despesas : receitas).map((entry, index) => (
                        <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="legend-list">
                  {(view === "pagar" ? despesas : receitas).map((entry, index) => (
                    <div className="legend-row" key={entry.name}>
                      <span style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                      <strong>{entry.name}</strong>
                      <em>{toCompactBrl(entry.value)}</em>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="comparison-card" id="empresas">
            <div className="card-heading">
              <div>
                <span className="eyebrow">Consolidado</span>
                <h2>Comparativo por empresa</h2>
              </div>
            </div>
            <div className="company-bars">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={selectedCompanies.map((company) => ({
                    name: company.name,
                    receita: company.metrics.receita,
                    resultado: company.metrics.resultado,
                    vencido: company.metrics.vencido,
                  }))}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#7a7a7a", fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="receita" fill="#0066cc" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="resultado" fill="#1d1d1f" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="vencido" fill="#d97706" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="tables-grid">
            <FinancialTable title="Contas a receber" items={receivables} emptyLabel="Sem contas a receber" />
            <FinancialTable title="Contas a pagar" items={payables} emptyLabel="Sem contas a pagar" />
          </section>
        </section>

        <aside className="right-panel" aria-label="Painel de controle">
          <section className="company-context">
            <div className="panel-heading">
              <span>Contexto</span>
              <button className="icon-button light" type="button" aria-label="Abrir configuracoes">
                <ArrowUpRight size={15} />
              </button>
            </div>
            <div className="context-stack">
              {companies.map((company) => {
                const active = selectedIds.includes(company.id);
                return (
                  <button
                    className={active ? "company-row active" : "company-row"}
                    key={company.id}
                    onClick={() => selectOnly(company.id)}
                    type="button"
                  >
                    <span className="company-dot" style={{ background: company.accent }} />
                    <span>
                      <strong>{company.name}</strong>
                      <em>{company.status}</em>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="sync-card" id="integracoes">
            <div className="panel-heading">
              <span>Integracoes</span>
              <DatabaseZap size={16} />
            </div>
            {companies.map((company) => (
              <div className="sync-row" key={company.id}>
                <strong>{company.name}</strong>
                <div>
                  <span>{company.integrations.asaas}</span>
                  <span>{company.integrations.contaAzul}</span>
                </div>
              </div>
            ))}
          </section>

          <section className="alerts-card">
            <div className="panel-heading">
              <span>Alertas</span>
              <CalendarDays size={16} />
            </div>
            <div className="alert-stack">
              {alerts.map((alert) => (
                <article className={alertClass(alert.tone)} key={`${alert.company}-${alert.title}`}>
                  <strong>{alert.title}</strong>
                  <p>{alert.text}</p>
                  <span>{alert.company}</span>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </main>

      <div className={filtersOpen ? "filter-sheet open" : "filter-sheet"} aria-hidden={!filtersOpen}>
        <div className="sheet-panel">
          <div className="sheet-header">
            <strong>Filtros</strong>
            <button className="icon-button light" onClick={() => setFiltersOpen(false)} type="button" aria-label="Fechar filtros">
              <X size={18} />
            </button>
          </div>
          <div className="sheet-companies">
            {companies.map((company) => {
              const active = selectedIds.includes(company.id);
              return (
                <button
                  className={active ? "sheet-company active" : "sheet-company"}
                  key={company.id}
                  onClick={() => toggleCompany(company.id)}
                  type="button"
                  aria-pressed={active}
                >
                  <span>{active ? <Check size={15} /> : null}</span>
                  <strong>{company.name}</strong>
                  <em>{company.segment}</em>
                </button>
              );
            })}
          </div>
          <button className="primary-pill sheet-action" onClick={() => setFiltersOpen(false)} type="button">
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-mini">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  delta,
  tone = "ok",
}: {
  icon: typeof TrendingUp;
  label: string;
  value: string;
  delta: string;
  tone?: "ok" | "warn";
}) {
  return (
    <article className="kpi-card">
      <div className="kpi-icon">
        <Icon size={18} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      <em className={tone === "warn" ? "warn" : ""}>{delta}</em>
    </article>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {label ? <strong>{label}</strong> : null}
      {payload.map((entry) => (
        <span key={entry.name}>
          {entry.name}: {toBrl(Number(entry.value))}
        </span>
      ))}
    </div>
  );
}

function FinancialTable({
  title,
  items,
  emptyLabel,
}: {
  title: string;
  items: (FinancialItem & { company: string })[];
  emptyLabel: string;
}) {
  return (
    <article className="table-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">{items.length} registros</span>
          <h2>{title}</h2>
        </div>
      </div>
      {items.length ? (
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
              {items.map((item) => (
                <tr key={`${item.company}-${item.cliente}-${item.valor}`}>
                  <td>{item.company}</td>
                  <td>{item.cliente}</td>
                  <td>{item.descricao}</td>
                  <td>{new Date(`${item.vencimento}T12:00:00`).toLocaleDateString("pt-BR")}</td>
                  <td>{toBrl(item.valor)}</td>
                  <td>
                    <span className={statusClass(item.status)}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">{emptyLabel}</div>
      )}
    </article>
  );
}
