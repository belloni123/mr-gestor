import { BookOpen, CheckCircle2, DatabaseZap, KeyRound, Megaphone, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { getProtectedPageContext } from "@/lib/protected-page";

export const dynamic = "force-dynamic";

const guides = [
  {
    title: "Primeiro acesso",
    text: "Troque a senha temporaria, configure o 2FA e confirme se as empresas liberadas para seu usuario estao corretas.",
    icon: KeyRound,
  },
  {
    title: "Dashboards",
    text: "Use a pagina inicial para analisar indicadores consolidados ou por empresa, com dados demonstrativos ate a entrada das integracoes reais.",
    icon: CheckCircle2,
  },
  {
    title: "Integracoes",
    text: "Asaas e Conta Azul ficarao conectados por empresa. Asaas usa API key e webhooks; Conta Azul usa OAuth e sincronizacao recorrente.",
    icon: DatabaseZap,
  },
  {
    title: "Seguranca",
    text: "O acesso usa sessao segura, MFA, controle por papel e permissao por empresa. Credenciais externas nao devem ser coladas no chat.",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: "Por que alguns dados ainda aparecem como demonstrativos?",
    answer: "Porque a integracao real com Asaas e Conta Azul sera feita depois do cadastro das credenciais oficiais e da conta developer.",
  },
  {
    question: "Editor consegue ver todas as empresas?",
    answer: "Nao. Editor so recebe no servidor as empresas vinculadas ao usuario dele. Super admin ve todas.",
  },
  {
    question: "Quando a Central de Ajuda deve ser atualizada?",
    answer: "Sempre que houver nova funcionalidade, tela, automacao, inteligencia, integracao ou mudanca operacional relevante.",
  },
  {
    question: "Onde o super admin gerencia usuarios?",
    answer: "Em Configuracoes ou diretamente em Usuarios, no menu lateral. Ali e possivel criar editor, resetar senha e limitar empresas.",
  },
];

export default async function HelpPage() {
  const { user } = await getProtectedPageContext();

  return (
    <AppShell
      user={user}
      eyebrow="Central de Ajuda"
      title="Ajuda e operacao"
      subtitle="Guias, duvidas frequentes e regras de manutencao para manter o MR Gestao apresentavel e consistente."
    >
      <section className="page-hero">
        <div>
          <span className="eyebrow">Comece por aqui</span>
          <h1>Uma central de ajuda de produto, nao apenas um bloco de texto.</h1>
          <p>
            Esta area passa a concentrar orientacoes de primeiro acesso, uso diario, permissoes, integracoes e novidades do
            sistema.
          </p>
        </div>
        <div className="page-hero-aside">
          <Megaphone size={22} />
          <strong>Regra permanente</strong>
          <p>Toda evolucao do MR Gestao deve atualizar esta central antes de ser apresentada ao cliente.</p>
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
