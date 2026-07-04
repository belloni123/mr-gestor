"use client";

import { useActionState } from "react";
import { UserPlus } from "lucide-react";

import { createUserAction, type AdminActionState } from "@/app/admin/users/actions";

type CompanyOption = {
  slug: string;
  name: string;
};

const initialState: AdminActionState = {
  ok: false,
  message: "",
};

export function CreateUserForm({ companies }: { companies: CompanyOption[] }) {
  const [state, formAction, pending] = useActionState(createUserAction, initialState);

  return (
    <form className="settings-card admin-form" action={formAction}>
      <div className="settings-heading">
        <span>Super admin</span>
        <h1>Novo usuario</h1>
        <p>Crie usuarios com senha inicial, troca obrigatoria e 2FA no primeiro acesso.</p>
      </div>

      <label>
        Nome
        <input name="name" required />
      </label>

      <label>
        E-mail
        <input name="email" type="email" autoComplete="off" required />
      </label>

      <label>
        Senha inicial
        <input name="password" type="password" minLength={12} autoComplete="new-password" required />
      </label>

      <label>
        Papel
        <select name="role" defaultValue="EDITOR">
          <option value="EDITOR">Editor</option>
          <option value="SUPER_ADMIN">Super admin</option>
        </select>
      </label>

      <fieldset className="checkbox-stack">
        <legend>Empresas permitidas</legend>
        {companies.map((company) => (
          <label key={company.slug}>
            <input name="companySlugs" type="checkbox" value={company.slug} />
            {company.name}
          </label>
        ))}
      </fieldset>

      {state.message ? <p className={state.ok ? "form-success" : "form-error"}>{state.message}</p> : null}

      <button className="auth-submit" disabled={pending} type="submit">
        <UserPlus size={17} />
        {pending ? "Criando..." : "Criar usuario"}
      </button>
    </form>
  );
}
