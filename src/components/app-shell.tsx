"use client";

import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  BookOpen,
  Building2,
  DatabaseZap,
  FileChartColumnIncreasing,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from "lucide-react";

import type { AuthSessionUser } from "@/lib/auth-types";

type NavigationItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  superAdminOnly?: boolean;
};

type AppShellProps = {
  user: AuthSessionUser;
  title: string;
  subtitle: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
};

const topLinks = [
  { label: "Dashboards", href: "/" },
  { label: "Ajuda", href: "/help" },
  { label: "Controladoria", href: "/controladoria" },
  { label: "Empresas", href: "/companies" },
  { label: "Integracoes", href: "/integrations" },
];

const moduleItems: NavigationItem[] = [
  { label: "Dashboards", icon: LayoutDashboard, href: "/" },
  { label: "Ajuda", icon: BookOpen, href: "/help" },
  { label: "Controladoria", icon: FileChartColumnIncreasing, href: "/controladoria" },
  { label: "Empresas", icon: Building2, href: "/companies" },
  { label: "Clientes", icon: Users, href: "/clients" },
  { label: "Integracoes", icon: DatabaseZap, href: "/integrations" },
  { label: "Governanca", icon: ShieldCheck, href: "/governance" },
  { label: "Usuarios", icon: UserCog, href: "/admin/users", superAdminOnly: true },
  { label: "Ajustes", icon: Settings, href: "/settings" },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ user, title, subtitle, eyebrow = "MR Gestao", actions, children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  }

  const visibleModules = moduleItems.filter((item) => !item.superAdminOnly || user.role === "SUPER_ADMIN");

  return (
    <div className="mr-app">
      <header className="global-nav">
        <div className="global-nav-inner">
          <a className="brand-mark" href="/" aria-label="MR Gestao inicio">
            <img src="/brand/mr-gestao-mark.svg" alt="" />
            <span>MR Gestão</span>
          </a>
          <nav className="global-links" aria-label="Navegacao principal">
            {topLinks.map((item) => (
              <a className={isActivePath(pathname, item.href) ? "active" : undefined} href={item.href} key={item.href}>
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
              <a className="icon-button" href="/admin/users" aria-label="Administrar usuarios" title="Administrar usuarios">
                <UserCog size={17} />
              </a>
            ) : null}
            <a className="icon-button" href="/settings" aria-label="Configuracoes" title="Configuracoes">
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
              aria-label="Notificacoes"
              aria-expanded={notificationsOpen}
              title="Notificacoes"
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
          <div className="floating-panel search-panel" role="dialog" aria-label="Busca rapida">
            <div className="panel-heading compact">
              <span>Busca rapida</span>
              <button className="icon-button light" onClick={() => setSearchOpen(false)} type="button" aria-label="Fechar busca">
                <X size={16} />
              </button>
            </div>
            <label className="search-field">
              <Search size={16} />
              <input placeholder="Buscar modulos, empresas e ajuda" />
            </label>
            <div className="quick-links">
              {visibleModules.map((item) => (
                <a href={item.href} key={item.href} onClick={() => setSearchOpen(false)}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {notificationsOpen ? (
          <div className="floating-panel notifications-panel" role="dialog" aria-label="Notificacoes">
            <div className="panel-heading compact">
              <span>Notificacoes</span>
              <button
                className="icon-button light"
                onClick={() => setNotificationsOpen(false)}
                type="button"
                aria-label="Fechar notificacoes"
              >
                <X size={16} />
              </button>
            </div>
            <div className="notification-stack">
              <a href="/integrations">
                <strong>Integracoes em preparacao</strong>
                <span>Asaas e Conta Azul seguem em modo demonstrativo.</span>
              </a>
              <a href="/help">
                <strong>Central de ajuda ampliada</strong>
                <span>Guias operacionais agora ficam em pagina propria.</span>
              </a>
            </div>
          </div>
        ) : null}

        {mobileMenuOpen ? (
          <div className="mobile-menu-panel" role="dialog" aria-label="Menu principal">
            <div className="mobile-menu-grid">
              {visibleModules.map((item) => (
                <a href={item.href} key={item.href}>
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

      <div className="sub-nav">
        <div className="sub-nav-inner">
          <div className="context-title">
            <span>{eyebrow}</span>
            <strong>{title}</strong>
          </div>
          <p className="sub-nav-description">{subtitle}</p>
          {actions ? <div className="sub-nav-actions">{actions}</div> : null}
        </div>
      </div>

      <main className="app-shell">
        <aside className="left-rail" aria-label="Modulos">
          {visibleModules.map((item) => {
            const Icon = item.icon;
            return (
              <a
                className={isActivePath(pathname, item.href) ? "rail-item active" : "rail-item"}
                href={item.href}
                key={item.href}
                title={item.label}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </aside>
        <section className="workspace page-workspace">{children}</section>
      </main>
    </div>
  );
}
