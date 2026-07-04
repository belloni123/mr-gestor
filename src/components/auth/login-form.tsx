"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

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
      setError(data.error ?? "Nao foi possivel entrar.");
      return;
    }

    window.location.href = data.setupRequired ? "/mfa/setup" : "/mfa/verify";
  }

  return (
    <form className="auth-card" onSubmit={onSubmit}>
      <div className="auth-mark">
        <ShieldCheck size={22} />
      </div>
      <div className="auth-heading">
        <span>Portal seguro</span>
        <h1>MR Gestor</h1>
        <p>Acesse com senha e dupla autenticacao.</p>
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
        {loading ? "Validando..." : "Entrar com seguranca"}
      </button>
    </form>
  );
}
