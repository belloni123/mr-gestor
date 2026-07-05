"use client";

import { FormEvent, useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";

export function MfaVerifyForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/mfa/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: formData.get("token"),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Código inválido.");
      return;
    }

    window.location.href = "/";
  }

  return (
    <form className="auth-card" onSubmit={onSubmit}>
      <div className="auth-mark">
        <ShieldCheck size={22} />
      </div>
      <div className="auth-heading">
        <span>Dupla autenticação</span>
        <h1>Código 2FA</h1>
        <p>Digite o código temporário do seu app autenticador.</p>
      </div>

      <label>
        Código de 6 dígitos
        <input name="token" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,10}" required />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="auth-submit" disabled={loading} type="submit">
        <KeyRound size={17} />
        {loading ? "Validando..." : "Validar código"}
      </button>
    </form>
  );
}
