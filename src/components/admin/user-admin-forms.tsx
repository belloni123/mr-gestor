"use client";

import { useActionState } from "react";
import { KeyRound, Save } from "lucide-react";

import {
  resetUserPasswordAction,
  updateUserCompaniesAction,
  type AdminActionState,
} from "@/app/admin/users/actions";

type CompanyOption = {
  slug: string;
  name: string;
};

type UserCompany = {
  slug: string;
};

type UserAdminFormsProps = {
  userId: string;
  companies: CompanyOption[];
  userCompanies: UserCompany[];
};

const initialState: AdminActionState = {
  ok: false,
  message: "",
};

export function UserCompaniesForm({ userId, companies, userCompanies }: UserAdminFormsProps) {
  const [state, formAction, pending] = useActionState(updateUserCompaniesAction, initialState);
  const selected = new Set(userCompanies.map((company) => company.slug));

  return (
    <form className="inline-admin-form" action={formAction}>
      <input name="userId" type="hidden" value={userId} />
      <div className="checkbox-stack compact">
        {companies.map((company) => (
          <label key={company.slug}>
            <input name="companySlugs" type="checkbox" value={company.slug} defaultChecked={selected.has(company.slug)} />
            {company.name}
          </label>
        ))}
      </div>
      {state.message ? <p className={state.ok ? "form-success" : "form-error"}>{state.message}</p> : null}
      <button className="secondary-action" disabled={pending} type="submit">
        <Save size={15} />
        Salvar empresas
      </button>
    </form>
  );
}

export function ResetPasswordForm({ userId }: { userId: string }) {
  const [state, formAction, pending] = useActionState(resetUserPasswordAction, initialState);

  return (
    <form className="inline-admin-form" action={formAction}>
      <input name="userId" type="hidden" value={userId} />
      <label>
        Nova senha inicial
        <input name="password" type="password" minLength={12} autoComplete="new-password" required />
      </label>
      {state.message ? <p className={state.ok ? "form-success" : "form-error"}>{state.message}</p> : null}
      <button className="secondary-action" disabled={pending} type="submit">
        <KeyRound size={15} />
        Resetar senha
      </button>
    </form>
  );
}
