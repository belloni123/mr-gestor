"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";

import { changeOwnPasswordAction, type PasswordState } from "@/app/account/security/actions";

const initialState: PasswordState = {
  ok: false,
  message: "",
};

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changeOwnPasswordAction, initialState);

  return (
    <form className="settings-card" action={formAction}>
      <div className="settings-heading">
        <span>Conta</span>
        <h1>Seguranca da conta</h1>
        <p>Troque sua senha inicial e mantenha 2FA ativo.</p>
      </div>

      <label>
        Senha atual
        <input name="currentPassword" type="password" autoComplete="current-password" required />
      </label>

      <label>
        Nova senha
        <input name="newPassword" type="password" autoComplete="new-password" minLength={12} required />
      </label>

      <label>
        Confirmar nova senha
        <input name="confirmPassword" type="password" autoComplete="new-password" minLength={12} required />
      </label>

      {state.message ? <p className={state.ok ? "form-success" : "form-error"}>{state.message}</p> : null}

      <button className="auth-submit" disabled={pending} type="submit">
        <KeyRound size={17} />
        {pending ? "Atualizando..." : "Alterar senha"}
      </button>
    </form>
  );
}
