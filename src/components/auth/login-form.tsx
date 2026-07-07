"use client";

import { FormEvent, useState } from "react";
import { Fingerprint, LockKeyhole, ShieldCheck } from "lucide-react";

export function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Não foi possível entrar.");
      return;
    }

    window.location.href = data.setupRequired ? "/mfa/setup" : "/mfa/verify";
  }

  return (
    <form className="auth-card" onSubmit={onSubmit}>
      <div className="auth-brand-panel" aria-label="MR Gestão">
        <img className="auth-logo-lockup" src="/brand/mr-gestao-logo.svg" alt="MR Gestão" />
      </div>

      <div className="auth-heading">
        <h1>Entre no seu centro de gestão</h1>
        <p>Visualize empresas, indicadores e rotinas de controladoria em um ambiente privado.</p>
      </div>

      <div className="auth-trust-row" aria-label="Recursos de segurança">
        <span>
          <ShieldCheck size={14} />
          2FA
        </span>
        <span>
          <LockKeyhole size={14} />
          Sessão protegida
        </span>
        <span>
          <Fingerprint size={14} />
          Acesso privado
        </span>
      </div>

      <label>
        E-mail
        <input name="email" type="email" autoComplete="email" required />
      </label>

      <label>
        Senha
        <input name="password" type="password" autoComplete="current-password" required />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="auth-submit" disabled={loading} type="submit">
        <LockKeyhole size={17} />
        {loading ? "Validando..." : "Entrar com segurança"}
      </button>
    </form>
  );
}
