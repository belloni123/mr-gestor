# Módulos do MR Gestor

Referência funcional dos módulos do hub. Benchmark: Hub Estratégico MR Cont
(demo), adaptado às particularidades do MR Gestor (multiempresa, RBAC e
integrações Asaas/Conta Azul).

## Navegação

A navegação lateral e a busca rápida são definidas em um único lugar:
`src/lib/navigation.ts`. Os módulos ficam agrupados em:

- **Uso diário**: Meu dia, Dashboards, Controladoria, Ajuda.
- **Estratégia**: Estratégia, Cronograma, Departamentos.
- **CRM & Marketing**: CRM & Vendas, Marketing, Clientes.
- **Organização**: Empresas, Integrações, Governança, Usuários (super admin)
  e Ajustes.

Para adicionar um módulo novo: criar a página em `src/app/<rota>/page.tsx`
usando `AppShell` + `getProtectedPageContext`, registrar o item em
`navigation.ts` e atualizar a Central de Ajuda (`/help`) e este documento.

## Meu dia (`/daily`)

- Saudação por horário e data por extenso (renderizada no cliente).
- Prioridades do dia: checklist com horário opcional, adicionar/remover e
  limpar concluídas. Persistência em `localStorage`, por usuário
  (`mr-gestor:daily-priorities:<userId>`). Não substitui registros oficiais.
- Atalhos externos (WhatsApp, e-mail, agenda, Conta Azul, Asaas) abrem em nova
  aba com `rel="noopener noreferrer"`.
- Atalhos internos para Controladoria, CRM, Cronograma e Ajuda.
- Mini calendário com feriados nacionais de 2026 e navegação entre meses.
- Alertas das empresas autorizadas (mesma fonte do dashboard).

## Estratégia (`/strategy`)

- Identidade: missão, visão, regras de cultura, ICP e política de comunicação.
- 7 pilares estratégicos com guardião, progresso e nota.
- OKRs do trimestre com key results, dono e percentual.
- 4 fases do planejamento (Diagnóstico, Estruturação, Execução, Escala).
- Dados em `src/lib/demo-strategy-data.ts`.

## Cronograma (`/roadmap`)

- Fita de fases com status.
- Gantt semanal (Jul–Dez 2026) por departamento: frente, ações, responsável,
  semanas de início/fim e percentual concluído por ação.
- Implementado com CSS grid (`--gantt-weeks`), com rolagem horizontal no
  mobile. Dados em `src/lib/demo-strategy-data.ts`.

## CRM & Vendas (`/crm`)

- KPIs: pipeline aberto, conversão do funil, ticket médio previsto e ciclo.
- Funil consolidado por estágio (Prospecção → Fechamento).
- Meta vs realizado por mês (gráfico de barras, Recharts).
- Tabela de oportunidades com estágio, valor, responsável e próximo passo.
- Atividades da semana (ligação, reunião, proposta, follow-up).
- **Isolamento**: oportunidades e atividades têm `companySlug` e são filtradas
  no servidor pelas empresas autorizadas do usuário
  (`getProtectedPageContext`). Dados em `src/lib/demo-crm-data.ts`.

## Marketing (`/marketing`)

- KPIs: investimento do mês, ROI consolidado, leads e CPL médio.
- Funil de maturidade (alcance → clientes).
- Investimento vs retorno por canal (gráfico de barras, Recharts).
- Planejamento de conteúdo do trimestre com status.
- OKRs de marketing. Dados em `src/lib/demo-marketing-data.ts`.

## Departamentos (`/departments`)

- Um card por departamento: missão, responsável, ritual semanal,
  3 indicadores com tom (ok/atenção/bom) e projetos com progresso.
- Os projetos de departamento correspondem às frentes do Cronograma.
- Dados em `src/lib/demo-departments-data.ts`.

## Estado dos dados

Todos os módulos acima usam **dados demonstrativos** tipados em `src/lib/`.
Quando as integrações Asaas/Conta Azul e o plano oficial entrarem, esses
arquivos devem ser substituídos por consultas ao banco mantendo os mesmos
tipos — as telas não precisam mudar.
