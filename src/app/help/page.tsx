import { BookOpen, CheckCircle2, DatabaseZap, KeyRound, Megaphone, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

const guides = [
  {
    title: "Primeiro acesso",
    text: "Troque a senha temporária, configure o 2FA e confirme se as empresas liberadas para seu usuário estão corretas.",
    icon: KeyRound,
  },
  {
    title: "Dashboards",
    text: "Use a página inicial para analisar indicadores consolidados ou por empresa, com dados demonstrativos até a entrada das integrações reais.",
    icon: CheckCircle2,
  },
  {
    title: "Integrações",
    text: "Asaas e Conta Azul ficarão conectados por empresa. Asaas usa API key e webhooks; Conta Azul usa OAuth e sincronização recorrente.",
    icon: DatabaseZap,
  },
  {
    title: "Segurança",
    text: "O acesso usa sessão segura, MFA, controle por papel e permissão por empresa. Credenciais externas não devem ser coladas no chat.",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: "Por que alguns dados ainda aparecem como demonstrativos?",
    answer: "Porque a integração real com Asaas e Conta Azul será feita depois do cadastro das credenciais oficiais e da conta developer.",
  },
  {
    question: "Editor consegue ver todas as empresas?",
    answer: "Não. Editor só recebe no servidor as empresas vinculadas ao usuário dele. Super admin vê todas.",
  },
  {
    question: "Quando a Central de Ajuda deve ser atualizada?",
    answer: "Sempre que houver nova funcionalidade, tela, automação, inteligência, integração ou mudança operacional relevante.",
  },
  {
    question: "Onde o super admin gerencia usuários?",
    answer: "Em Configurações ou diretamente em Usuários, no menu lateral. Ali é possível criar editor, resetar senha e limitar empresas.",
  },
];

export default async function HelpPage() {
  const { user } = await getProtectedPageContext();

  return (
    <AppShell
      user={user}
      eyebrow="Central de Ajuda"
      title="Ajuda e operação"
      subtitle="Guias, dúvidas frequentes e regras de manutenção para manter o MR Gestão apresentável e consistente."
    >
      <section className="page-hero">
        <div>
          <span className="eyebrow">Comece por aqui</span>
          <h1>Uma central de ajuda de produto, não apenas um bloco de texto.</h1>
          <p>
            Esta área passa a concentrar orientações de primeiro acesso, uso diário, permissões, integrações e novidades do
            sistema.
          </p>
        </div>
        <div className="page-hero-aside">
          <Megaphone size={22} />
          <strong>Regra permanente</strong>
          <p>Toda evolução do MR Gestão deve atualizar esta central antes de ser apresentada ao cliente.</p>
        </div>
      </section>

      <section className="page-card-grid">
        {guides.map((guide) => {
          const Icon = guide.icon;
          return (
            <article className="page-card" key={guide.title}>
              <Icon size={20} />
              <h2>{guide.title}</h2>
              <p>{guide.text}</p>
            </article>
          );
        })}
      </section>

      <section className="page-section">
        <div className="section-heading">
          <BookOpen size={20} />
          <div>
            <span className="eyebrow">FAQ</span>
            <h2>Perguntas frequentes</h2>
          </div>
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <article className="faq-item" key={item.question}>
              <strong>{item.question}</strong>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
