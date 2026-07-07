"use client";

import { useActionState } from "react";
import { Building2, KeyRound, PlugZap, RefreshCcw, Save } from "lucide-react";

import {
  createCompanyAction,
  rotateCompanyTokenAction,
  updateCompanyAction,
  upsertIntegrationCredentialAction,
  type CompanyActionState,
} from "@/app/companies/actions";

type IntegrationCredential = {
  provider: "ASAAS" | "CONTA_AZUL";
  environment: "SANDBOX" | "PRODUCTION";
  credentialLastFour: string | null;
  refreshLastFour: string | null;
  externalAccountId: string | null;
  status: string;
};

type CompanyAdminFormsProps = {
  company: {
    id: string;
    slug: string;
    code: string | null;
    name: string;
    legalName: string | null;
    isActive: boolean;
    integrationTokenLastFour: string | null;
    integrationTokenUpdatedAt: Date | null;
    integrationCredentials: IntegrationCredential[];
  };
};

const initialState: CompanyActionState = {
  ok: false,
  message: "",
};

const providerLabels = {
  ASAAS: "Asaas",
  CONTA_AZUL: "Conta Azul",
};

function SecretResult({ state }: { state: CompanyActionState }) {
  if (!state.message) return null;

  return (
    <div className={state.ok ? "secure-result success" : "secure-result error"}>
      <span>{state.message}</span>
      {state.revealedToken ? <code>{state.revealedToken}</code> : null}
    </div>
  );
}

export function CreateCompanyForm() {
  const [state, formAction, pending] = useActionState(createCompanyAction, initialState);

  return (
    <form className="settings-card company-admin-form" action={formAction}>
      <div className="settings-heading icon-heading">
        <Building2 size={22} />
        <div>
          <span>Super admin</span>
          <h2>Cadastrar empresa</h2>
          <p>Defina a empresa, o código interno e o token usado para conciliação das futuras integrações.</p>
        </div>
      </div>

      <div className="form-grid two">
        <label>
          Nome da empresa
          <input name="name" placeholder="Ex.: Agência B16" required />
        </label>
        <label>
          Código interno
          <input name="code" placeholder="Ex.: B16" required />
        </label>
        <label>
          Slug
          <input name="slug" placeholder="Ex.: agencia-b16" />
        </label>
        <label>
          Razão social
          <input name="legalName" placeholder="Opcional" />
        </label>
      </div>

      <label>
        Token interno da empresa
        <input name="integrationToken" placeholder="Deixe em branco para gerar automaticamente" />
      </label>

      <SecretResult state={state} />

      <button className="auth-submit" disabled={pending} type="submit">
        <Building2 size={17} />
        {pending ? "Cadastrando..." : "Cadastrar empresa"}
      </button>
    </form>
  );
}

export function CompanyAdminForms({ company }: CompanyAdminFormsProps) {
  const [detailsState, detailsAction, detailsPending] = useActionState(updateCompanyAction, initialState);
  const [tokenState, tokenAction, tokenPending] = useActionState(rotateCompanyTokenAction, initialState);

  return (
    <div className="company-admin-panel">
      <form className="company-admin-mini-form" action={detailsAction}>
        <input name="companyId" type="hidden" value={company.id} />
        <div className="mini-form-heading">
          <Save size={17} />
          <strong>Dados cadastrais</strong>
        </div>

        <div className="form-grid two">
          <label>
            Nome
            <input name="name" defaultValue={company.name} required />
          </label>
          <label>
            Código
            <input name="code" defaultValue={company.code ?? ""} required />
          </label>
          <label>
            Slug
            <input name="slug" defaultValue={company.slug} required />
          </label>
          <label>
            Razão social
            <input name="legalName" defaultValue={company.legalName ?? ""} />
          </label>
        </div>

        <label className="toggle-row">
          <input name="isActive" type="checkbox" defaultChecked={company.isActive} />
          Empresa ativa
        </label>

        <SecretResult state={detailsState} />

        <button className="secondary-action" disabled={detailsPending} type="submit">
          <Save size={15} />
          Salvar dados
        </button>
      </form>

      <form className="company-admin-mini-form" action={tokenAction}>
        <input name="companyId" type="hidden" value={company.id} />
        <div className="mini-form-heading">
          <KeyRound size={17} />
          <strong>Token interno</strong>
        </div>

        <p className="secret-caption">
          Token atual: {company.integrationTokenLastFour ? `termina em ${company.integrationTokenLastFour}` : "não configurado"}.
        </p>

        <label>
          Novo token
          <input name="integrationToken" placeholder="Deixe em branco para gerar um novo" />
        </label>

        <SecretResult state={tokenState} />

        <button className="secondary-action" disabled={tokenPending} type="submit">
          <RefreshCcw size={15} />
          Atualizar token
        </button>
      </form>

      <div className="integration-credential-grid">
        {(["ASAAS", "CONTA_AZUL"] as const).map((provider) => {
          const credential = company.integrationCredentials.find((item) => item.provider === provider);

          return (
            <IntegrationCredentialForm
              companyId={company.id}
              credential={credential}
              key={provider}
              provider={provider}
            />
          );
        })}
      </div>
    </div>
  );
}

function IntegrationCredentialForm({
  companyId,
  provider,
  credential,
}: {
  companyId: string;
  provider: "ASAAS" | "CONTA_AZUL";
  credential?: IntegrationCredential;
}) {
  const [state, formAction, pending] = useActionState(upsertIntegrationCredentialAction, initialState);

  return (
    <form className="company-admin-mini-form integration-credential-form" action={formAction}>
      <input name="companyId" type="hidden" value={companyId} />
      <input name="provider" type="hidden" value={provider} />

      <div className="mini-form-heading">
        <PlugZap size={17} />
        <strong>{providerLabels[provider]}</strong>
      </div>

      <div className="credential-summary">
        <span>{credential?.credentialLastFour ? `Token/API termina em ${credential.credentialLastFour}` : "Token/API pendente"}</span>
        {provider === "CONTA_AZUL" ? (
          <span>{credential?.refreshLastFour ? `Refresh termina em ${credential.refreshLastFour}` : "Refresh token pendente"}</span>
        ) : null}
      </div>

      <div className="form-grid two">
        <label>
          Ambiente
          <select name="environment" defaultValue={credential?.environment ?? "SANDBOX"}>
            <option value="SANDBOX">Sandbox</option>
            <option value="PRODUCTION">Produção</option>
          </select>
        </label>
        <label>
          Status
          <select name="status" defaultValue={credential?.status ?? "PENDING"}>
            <option value="PENDING">Pendente</option>
            <option value="READY">Pronto</option>
            <option value="CONNECTED">Conectado</option>
            <option value="ERROR">Erro</option>
          </select>
        </label>
      </div>

      <label>
        ID externo/tenant
        <input name="externalAccountId" defaultValue={credential?.externalAccountId ?? ""} placeholder="Opcional" />
      </label>

      <label>
        Token/API key
        <input name="credential" placeholder="Deixe em branco para manter o token atual" />
      </label>

      {provider === "CONTA_AZUL" ? (
        <label>
          Refresh token
          <input name="refreshToken" placeholder="Deixe em branco para manter o refresh atual" />
        </label>
      ) : null}

      <SecretResult state={state} />

      <button className="secondary-action" disabled={pending} type="submit">
        <KeyRound size={15} />
        Salvar credenciais
      </button>
    </form>
  );
}
