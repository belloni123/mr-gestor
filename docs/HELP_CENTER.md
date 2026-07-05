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

- A navegação principal foi separada em páginas reais: dashboard, ajuda,
  controladoria, empresas, clientes, integrações, governança e configurações.
- A Central de Ajuda agora possui página própria em `/help`.
- Configurações agora possui hub administrativo em `/settings`; troca de senha
  continua em `/account/security`.
- Login usa fundo fotográfico local, card com efeito premium e animação de
  entrada respeitando preferência de movimento reduzido.
- Configurações recebeu reforço iconográfico para atalhos, status de acesso e
  empresas permitidas.
- Login, 2FA, RBAC, troca de senha e administração de usuários estão ativos.
- Banco PostgreSQL está em produção no Coolify.
- Dashboards ainda usam dados demonstrativos filtrados por permissão.
- Asaas e Conta Azul aparecem como status operacional, mas a sincronização real
  ainda depende da implementação dos conectores e credenciais.
