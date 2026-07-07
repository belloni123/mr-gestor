# Central de Ajuda

## Regra permanente

A Central de Ajuda do MR Gestor deve ser atualizada no mesmo commit de qualquer
mudança que altere a experiência, a operação ou a interpretação dos dados.

Isso inclui:

- Nova tela, botão, menu ou fluxo.
- Nova inteligência, automação ou alerta.
- Nova integração ou alteração no status de Asaas/Conta Azul.
- Mudança de permissão, papel, empresa ou regra de acesso.
- Nova métrica, gráfico, filtro, exportação ou relatório.
- Mudança de segurança que afete login, 2FA, senha, sessão ou auditoria.

## Onde atualizar

- Conteúdo visível principal: `src/app/help/page.tsx`.
- Conteúdo resumido do dashboard: `src/components/mr-gestor-app.tsx`, bloco
  `helpCards` e seção `Central de Ajuda`.
- Política de produto: `docs/PDR.md`.
- Regras de manutenção para agentes: `AGENTS.md`.
- Documentos específicos quando aplicável: `docs/RBAC.md`,
  `docs/DEPLOYMENT.md` e `docs/SECURITY_CHECKLIST.md`.

## Conteúdo mínimo por novidade

Cada atualização deve responder:

- O que mudou.
- Quem pode usar.
- Quais empresas/dados são afetados.
- Se a funcionalidade usa dados reais ou demonstrativos.
- Quais cuidados de segurança ou operação existem.

## Estado atual

- A navegação principal foi separada em páginas reais e reorganizada em grupos:
  Uso diário, Estratégia, CRM & Marketing e Organização.
- Novos módulos inspirados no Hub Estratégico de referência:
  - `/daily` (Meu dia): prioridades do dia por usuário (localStorage do
    navegador), atalhos externos e internos, mini calendário com feriados
    nacionais de 2026 e alertas das empresas autorizadas.
  - `/strategy` (Estratégia): missão, visão, cultura, ICP, política de
    comunicação, 7 pilares estratégicos com progresso, OKRs do trimestre e as
    4 fases do planejamento.
  - `/roadmap` (Cronograma): Gantt semanal Jul–Dez 2026 por departamento, com
    responsável e percentual de avanço por ação.
  - `/crm` (CRM & Vendas): KPIs comerciais, funil por estágio, meta vs
    realizado, tabela de oportunidades e atividades da semana. Oportunidades e
    atividades são filtradas no servidor pelas empresas do usuário.
  - `/marketing` (Marketing): funil de maturidade, investimento vs retorno por
    canal, planejamento de conteúdo do trimestre e OKRs de marketing.
  - `/departments` (Departamentos): missão, responsável, indicadores, projetos
    e ritual semanal de cada time.
- Todos os módulos novos usam dados demonstrativos, prontos para receber dados
  reais na fase de integrações.
- A busca rápida do topo filtra os módulos por nome e descrição.
- A Central de Ajuda possui página própria em `/help`, com seção de novidades.
- Configurações possui hub administrativo em `/settings`; troca de senha
  continua em `/account/security`.
- Login, 2FA, RBAC, troca de senha e administração de usuários estão ativos.
- Reforços de segurança desta versão: limite de 5 tentativas de código 2FA,
  invalidação de sessões antigas após troca de senha ou desativação de
  usuário, redirecionamento imediato de visitantes sem sessão (proxy),
  CSP sem `unsafe-eval` em produção e bloqueio de indexação
  (robots + X-Robots-Tag).
- Banco PostgreSQL está em produção no Coolify.
- Dashboards ainda usam dados demonstrativos filtrados por permissão.
- Asaas e Conta Azul aparecem como status operacional, mas a sincronização real
  ainda depende da implementação dos conectores e credenciais.
