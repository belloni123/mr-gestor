import {
  BookOpen,
  CalendarCheck2,
  CalendarRange,
  CheckCircle2,
  DatabaseZap,
  Handshake,
  KeyRound,
  Megaphone,
  Network,
  ShieldCheck,
  Target,
} from "lucide-react";

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
    title: "Meu dia",
    text: "Comece o dia em /daily: prioridades pessoais (salvas no seu navegador), atalhos externos e internos, calendário com feriados e alertas das empresas.",
    icon: CalendarCheck2,
  },
  {
    title: "Dashboards",
    text: "Use a página inicial para analisar indicadores consolidados ou por empresa, com dados demonstrativos até a entrada das integrações reais.",
    icon: CheckCircle2,
  },
  {
    title: "Estratégia e Cronograma",
    text: "Estratégia mostra identidade, pilares, OKRs e fases do plano. Cronograma mostra a execução semana a semana por departamento, com responsável e avanço.",
    icon: Target,
  },
  {
    title: "CRM & Vendas",
    text: "Funil comercial, oportunidades, metas e atividades da semana. Editor vê apenas oportunidades das empresas vinculadas ao próprio usuário.",
    icon: Handshake,
  },
  {
    title: "Marketing",
    text: "Funil de maturidade, investimento vs retorno por canal, calendário de conteúdo do trimestre e OKRs de marketing — tudo em dados demonstrativos.",
    icon: Megaphone,
  },
  {
    title: "Departamentos",
    text: "Cada time com missão, responsável, indicadores, projetos e ritual semanal. Os projetos aparecem também no Cronograma estratégico.",
    icon: Network,
  },
  {
    title: "Integrações",
    text: "Asaas e Conta Azul ficarão conectados por empresa. Asaas usa API key e webhooks; Conta Azul usa OAuth e sincronização recorrente.",
    icon: DatabaseZap,
  },
  {
    title: "Segurança",
    text: "Sessão segura com MFA, limite de tentativas de 2FA, bloqueio de indexação, papel por usuário e isolamento por empresa. Sessões antigas caem após troca de senha.",
    icon: ShieldCheck,
  },
];

const faqs = [
  {
    question: "Por que alguns dados ainda aparecem como demonstrativos?",
    answer:
      "Porque a integração real com Asaas e Conta Azul será feita depois do cadastro das credenciais oficiais e da conta developer. Os módulos novos (CRM, Marketing, Estratégia, Cronograma e Departamentos) também usam dados demonstrativos até serem alimentados com o plano oficial.",
  },
  {
    question: "Editor consegue ver todas as empresas?",
    answer:
      "Não. Editor só recebe no servidor as empresas vinculadas ao usuário dele — inclusive no CRM, onde oportunidades e atividades são filtradas pela mesma regra. Super admin vê todas.",
  },
  {
    question: "Onde ficam salvas as prioridades do Meu dia?",
    answer:
      "No navegador de quem usa (localStorage), separadas por usuário. Elas não vão para o banco e não são compartilhadas entre dispositivos — use os módulos oficiais para registros permanentes.",
  },
  {
    question: "O que acontece se eu errar o código 2FA várias vezes?",
    answer:
      "Após 5 tentativas incorretas a sessão de verificação é encerrada e é preciso fazer login novamente. Tentativas ficam registradas na trilha de auditoria.",
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

const changelog = [
  {
    title: "Módulos de uso diário e estratégia",
    text: "Novas telas: Meu dia (/daily), Estratégia (/strategy), Cronograma (/roadmap), CRM & Vendas (/crm), Marketing (/marketing) e Departamentos (/departments). Navegação lateral reorganizada em grupos.",
  },
  {
    title: "Busca rápida funcional",
    text: "A busca do topo agora filtra os módulos do hub pelo nome e pela descrição.",
  },
  {
    title: "Reforço de segurança",
    text: "Limite de 5 tentativas no 2FA, sessões antigas invalidadas após troca de senha ou desativação, redirecionamento imediato de visitantes sem sessão e bloqueio de indexação por buscadores.",
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
            Esta área concentra orientações de primeiro acesso, uso diário, estratégia, CRM, marketing, permissões,
            integrações e novidades do sistema.
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
          <CalendarRange size={20} />
          <div>
            <span className="eyebrow">Novidades</span>
            <h2>O que mudou nesta versão</h2>
          </div>
        </div>
        <div className="faq-list">
          {changelog.map((item) => (
            <article className="faq-item" key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
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
