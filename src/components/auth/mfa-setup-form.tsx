"use client";

import { FormEvent, useEffect, useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import Image from "next/image";

type Enrollment = {
  qrDataUrl: string;
  secret: string;
};

export function MfaSetupForm() {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/mfa/setup")
      .then((response) => response.json().then((data) => ({ response, data })))
      .then(({ response, data }) => {
        if (cancelled) return;
        if (!response.ok) {
          setError(data.error ?? "Setup de 2FA indisponível.");
          return;
        }
        setEnrollment(data);
      })
      .catch(() => {
        if (!cancelled) setError("Não foi possível carregar o QR Code.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/mfa/setup", {
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
    <form className="auth-card auth-card-wide" onSubmit={onSubmit}>
      <div className="auth-mark">
        <ShieldCheck size={22} />
      </div>
      <div className="auth-heading">
        <span>Primeiro acesso</span>
        <h1>Ativar 2FA</h1>
        <p>Escaneie o QR Code no Google Authenticator, 1Password, Authy ou app equivalente.</p>
      </div>

      {enrollment ? (
        <div className="mfa-enrollment">
          <Image src={enrollment.qrDataUrl} alt="QR Code para configurar 2FA" width={220} height={220} unoptimized />
          <div>
            <span>Chave manual</span>
            <code>{enrollment.secret}</code>
          </div>
        </div>
      ) : (
        <div className="auth-loading">Gerando QR Code seguro...</div>
      )}

      <label>
        Código de 6 dígitos
        <input name="token" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,10}" required />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button className="auth-submit" disabled={loading || !enrollment} type="submit">
        <KeyRound size={17} />
        {loading ? "Validando..." : "Ativar e entrar"}
      </button>
    </form>
  );
}
