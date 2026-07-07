"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogOut, Menu, Search, Settings, UserCog, X } from "lucide-react";

import type { AuthSessionUser } from "@/lib/auth-types";
import { flattenNavigation, isActivePath, navigationGroups, topLinks } from "@/lib/navigation";

type AppShellProps = {
  user: AuthSessionUser;
  title: string;
  subtitle: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AppShell({ user, title, subtitle, eyebrow = "MR Gestão", actions, children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  }

  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const visibleModules = flattenNavigation(isSuperAdmin);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? visibleModules.filter(
        (item) =>
          item.label.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery),
      )
    : visibleModules;

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
              <a className={isActivePath(pathname, item.href) ? "active" : undefined} href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="nav-actions">
            <div className="account-pill">
              <span>{isSuperAdmin ? "Super admin" : "Editor"}</span>
              <strong>{user.name}</strong>
            </div>
            {isSuperAdmin ? (
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
              <input
                placeholder="Buscar módulos, empresas e ajuda"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                autoFocus
              />
            </label>
            <div className="quick-links">
              {searchResults.map((item) => (
                <a
                  href={item.href}
                  key={item.href}
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                >
                  {item.label}
                </a>
              ))}
              {!searchResults.length ? <span className="search-empty">Nada encontrado para “{searchQuery}”.</span> : null}
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
              <a href="/daily">
                <strong>Novo: módulo Meu dia</strong>
                <span>Prioridades, atalhos, calendário e alertas em uma tela.</span>
              </a>
              <a href="/strategy">
                <strong>Novo: Estratégia, CRM e Marketing</strong>
                <span>O hub agora cobre o uso diário e a camada estratégica.</span>
              </a>
              <a href="/integrations">
                <strong>Integrações em preparação</strong>
                <span>Asaas e Conta Azul seguem em modo demonstrativo.</span>
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
        <aside className="left-rail" aria-label="Módulos">
          {navigationGroups.map((group) => {
            const items = group.items.filter((item) => !item.superAdminOnly || isSuperAdmin);
            if (!items.length) return null;
            return (
              <div className="rail-group" key={group.label}>
                <span className="rail-group-label">{group.label}</span>
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      className={isActivePath(pathname, item.href) ? "rail-item active" : "rail-item"}
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
        <section className="workspace page-workspace">{children}</section>
      </main>
    </div>
  );
}
