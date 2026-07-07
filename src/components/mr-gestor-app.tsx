"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  ClipboardList,
  DatabaseZap,
  FileChartColumnIncreasing,
  Filter,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  PieChart as PieChartIcon,
  RefreshCcw,
  Search,
  Settings,
  TrendingUp,
  UserCog,
  WalletCards,
  X,
} from "lucide-react";
import type { AuthSessionUser } from "@/lib/auth-types";
import type { Alert, DashboardCompany, FinancialItem } from "@/lib/dashboard-types";
import { flattenNavigation, navigationGroups, topLinks } from "@/lib/navigation";

type Company = DashboardCompany;
type DashboardView = "executivo" | "controladoria" | "receber" | "pagar";

type MrGestorAppProps = {
  companies: Company[];
  user: AuthSessionUser;
};

const views: { id: DashboardView; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "executivo", label: "Executivo", icon: LayoutDashboard },
  { id: "controladoria", label: "Controladoria", icon: FileChartColumnIncreasing },
  { id: "receber", label: "Receber", icon: CircleDollarSign },
  { id: "pagar", label: "Pagar", icon: WalletCards },
];

const pieColors = ["#0066cc", "#1d1d1f", "#7a7a7a", "#2997ff", "#cccccc"];

const helpCards = [
  {
    title: "Primeiro acesso",
    text: "Ative o 2FA, troque a senha temporária e confira se o seu usuário está nas empresas corretas.",
    icon: CheckCircle2,
  },
  {
    title: "Leitura dos dados",
    text: "Use os chips de empresa para ver uma empresa isolada ou consolidar várias empresas no mesmo dashboard.",
    icon: ClipboardList,
  },
  {
    title: "Status das integrações",
    text: "Esta versão já está pronta para apresentação segura, mas Asaas e Conta Azul ainda estão em modo demonstrativo.",
    icon: Info,
  },
  {
    title: "Novidades do MR Gestor",
    text: "Novos módulos: Meu dia, Estratégia, Cronograma, CRM & Vendas, Marketing e Departamentos — veja a Central de Ajuda.",
    icon: Megaphone,
  },
];

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
  const months = items[0]?.monthly.map((point) => point.month) ?? [];
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

export function MrGestorApp({ companies, user }: MrGestorAppProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(companies.map((company) => company.id));
  const [view, setView] = useState<DashboardView>("executivo");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [syncNotice, setSyncNotice] = useState("Dados demonstrativos carregados para apresentação.");

  const selectedCompanies = useMemo(() => {
    const filtered = companies.filter((company) => selectedIds.includes(company.id));
    return filtered.length ? filtered : companies;
  }, [companies, selectedIds]);

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

  function closeFloatingPanels() {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setNotificationsOpen(false);
  }

  function handleSectionClick() {
    closeFloatingPanels();
  }

  function openFilters() {
    setFiltersOpen(true);
    closeFloatingPanels();
  }

  function showSyncStatus() {
    setSyncNotice(
      "Sincronização real ainda depende das credenciais Asaas e Conta Azul. O painel atual usa dados demonstrativos seguros.",
    );
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  }

  const selectedLabel =
    selectedCompanies.length === companies.length
      ? "Todas as empresas"
      : selectedCompanies.map((company) => company.name).join(" + ");

  return (
    <div className="mr-app">
      <header className="global-nav">
        <div className="global-nav-inner">
          <Link className="brand-mark" href="/" aria-label="MR Gestão início">
            <img src="/brand/mr-gestao-mark.svg" alt="" />
            <span>MR Gestão</span>
          </Link>
          <nav className="global-links" aria-label="Navegação principal">
            {topLinks.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <div className="account-pill">
              <span>{user.role === "SUPER_ADMIN" ? "Super admin" : "Editor"}</span>
              <strong>{user.name}</strong>
            </div>
            {user.role === "SUPER_ADMIN" ? (
              <a className="icon-button" href="/admin/users" aria-label="Administrar usuários" title="Administrar usuários">
                <UserCog size={17} />
              </a>
            ) : null}
            <a className="icon-button" href="/settings" aria-label="Configurações" title="Configurações">
              <Settings size={17} />
            </a>
            <button
              className="icon-button"
              onClick={() => {
                setSearchOpen((current) => !current);
                setNotificationsOpen(false);
                setMobileMenuOpen(false);
              }}
              type="button"
              aria-label="Buscar"
              aria-expanded={searchOpen}
              title="Buscar"
            >
              <Search size={17} />
            </button>
            <button
              className="icon-button"
              onClick={() => {
                setNotificationsOpen((current) => !current);
                setSearchOpen(false);
                setMobileMenuOpen(false);
              }}
              type="button"
              aria-label="Notificações"
              aria-expanded={notificationsOpen}
              title="Notificações"
            >
              <Bell size={17} />
            </button>
            <button className="icon-button" onClick={logout} type="button" aria-label="Sair" title="Sair">
              <LogOut size={17} />
            </button>
            <button
              className="menu-button"
              onClick={() => {
                setMobileMenuOpen((current) => !current);
                setSearchOpen(false);
                setNotificationsOpen(false);
              }}
              type="button"
              aria-label="Abrir menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
        {searchOpen ? (
          <div className="floating-panel search-panel" role="dialog" aria-label="Busca rápida">
            <div className="panel-heading compact">
              <span>Busca rápida</span>
              <button className="icon-button light" onClick={() => setSearchOpen(false)} type="button" aria-label="Fechar busca">
                <X size={16} />
              </button>
            </div>
            <label className="search-field">
              <Search size={16} />
              <input placeholder="Buscar módulos, empresas e ajuda" />
            </label>
            <div className="quick-links">
              {flattenNavigation(user.role === "SUPER_ADMIN").map((item) => (
                <a href={item.href} key={item.href} onClick={handleSectionClick}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
        {notificationsOpen ? (
          <div className="floating-panel notifications-panel" role="dialog" aria-label="Notificações">
            <div className="panel-heading compact">
              <span>Notificações</span>
              <button
                className="icon-button light"
                onClick={() => setNotificationsOpen(false)}
                type="button"
                aria-label="Fechar notificações"
              >
                <X size={16} />
              </button>
            </div>
            <div className="notification-stack">
              {alerts.slice(0, 4).map((alert) => (
                <a href="#notificacoes" key={`${alert.company}-${alert.title}`} onClick={handleSectionClick}>
                  <strong>{alert.title}</strong>
                  <span>{alert.company}</span>
                </a>
              ))}
            </div>
          </div>
        ) : null}
        {mobileMenuOpen ? (
          <div className="mobile-menu-panel" role="dialog" aria-label="Menu principal">
            <div className="mobile-menu-grid">
              {flattenNavigation(user.role === "SUPER_ADMIN").map((item) => (
                <a href={item.href} key={item.href} onClick={handleSectionClick}>
                  {item.label}
                </a>
              ))}
              <button onClick={logout} type="button">
                Sair
              </button>
            </div>
          </div>
        ) : null}
      </header>

      <div className="sub-nav" id="top">
        <div className="sub-nav-inner">
          <div className="context-title">
            <span>Controladoria</span>
            <strong>{selectedLabel}</strong>
          </div>
          <div className="sub-nav-actions">
            <button className="filter-trigger" onClick={openFilters} type="button">
              <Filter size={16} />
              Filtros
            </button>
            <button className="period-pill" onClick={openFilters} type="button" aria-label="Alterar período">
              Jul 2026
              <ChevronDown size={15} />
            </button>
            <button className="primary-pill" onClick={showSyncStatus} type="button" aria-describedby="sync-status">
              <RefreshCcw size={15} />
              Sincronizar
            </button>
          </div>
        </div>
      </div>

      <main className="app-shell">
        <aside className="left-rail" aria-label="Módulos">
          {navigationGroups.map((group) => {
            const items = group.items.filter((item) => !item.superAdminOnly || user.role === "SUPER_ADMIN");
            if (!items.length) return null;
            return (
              <div className="rail-group" key={group.label}>
                <span className="rail-group-label">{group.label}</span>
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      className={item.href === "/" ? "rail-item active" : "rail-item"}
                      href={item.href}
                      key={item.href}
                      title={item.description}
                    >
                      <Icon size={19} />
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </div>
            );
          })}
        </aside>

        <section className="workspace" id="dashboards">
          <section className="hero-tile" aria-labelledby="hero-title">
            <div className="hero-copy">
              <span className="eyebrow">Uso interno e portal do cliente</span>
              <h1 id="hero-title">MR Gestão</h1>
              <p>
                {selectedCompanies.length} empresa{selectedCompanies.length > 1 ? "s" : ""} em contexto.
              </p>
              <p className="sync-status-note" id="sync-status" aria-live="polite">
                {syncNotice}
              </p>
            </div>
            <div className="hero-metrics">
              <MetricMini label="Receita" value={toCompactBrl(totals.receita)} />
              <MetricMini label="Resultado" value={toCompactBrl(totals.resultado)} />
              <MetricMini label="Inadimplência" value={toPercent(totals.inadimplencia)} />
            </div>
          </section>

          <section className="help-center" id="ajuda" aria-labelledby="help-title">
            <div className="help-intro">
              <span className="eyebrow">Central de Ajuda</span>
              <h2 id="help-title">Comece por aqui</h2>
              <p>
                Orientações essenciais para usar o portal, entender o status dos dados e acompanhar as novidades do MR Gestor.
              </p>
            </div>
            <div className="help-card-grid">
              {helpCards.map((card) => {
                const Icon = card.icon;
                const cardId =
                  card.title === "Primeiro acesso"
                    ? "acessos"
                    : card.title === "Novidades do MR Gestor"
                      ? "governanca"
                      : undefined;
                return (
                  <article className="help-card" id={cardId} key={card.title}>
                    <Icon size={18} />
                    <strong>{card.title}</strong>
                    <p>{card.text}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="company-filter-bar" aria-label="Seleção de empresas">
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

          <section className="view-tabs" aria-label="Visões do dashboard">
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
              <KpiCard icon={TrendingUp} label="Receita do período" value={toBrl(totals.receita)} delta="+5,1% vs mês anterior" />
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
                  <span className="eyebrow">Composição</span>
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

          <section className="tables-grid" id="clientes">
            <FinancialTable title="Contas a receber" items={receivables} emptyLabel="Sem contas a receber" />
            <FinancialTable title="Contas a pagar" items={payables} emptyLabel="Sem contas a pagar" />
          </section>
        </section>

        <aside className="right-panel" aria-label="Painel de controle">
          <section className="company-context">
            <div className="panel-heading">
              <span>Contexto</span>
              <button className="icon-button light" onClick={openFilters} type="button" aria-label="Abrir filtros de contexto" title="Abrir filtros">
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
              <span>Integrações</span>
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

          <section className="alerts-card" id="notificacoes">
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
                <th>Descrição</th>
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
