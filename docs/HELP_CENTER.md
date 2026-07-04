# Central de Ajuda

## Regra permanente

A Central de Ajuda do MR Gestor deve ser atualizada no mesmo commit de qualquer
mudanca que altere a experiencia, a operacao ou a interpretacao dos dados.

Isso inclui:

- Nova tela, botao, menu ou fluxo.
- Nova inteligencia, automacao ou alerta.
- Nova integracao ou alteracao no status de Asaas/Conta Azul.
- Mudanca de permissao, papel, empresa ou regra de acesso.
- Nova metrica, grafico, filtro, exportacao ou relatorio.
- Mudanca de seguranca que afete login, 2FA, senha, sessao ou auditoria.

## Onde atualizar

- Conteudo visivel: `src/components/mr-gestor-app.tsx`, bloco `helpCards` e
  secao `Central de Ajuda`.
- Politica de produto: `docs/PDR.md`.
- Regras de manutencao para agentes: `AGENTS.md`.
- Documentos especificos quando aplicavel: `docs/RBAC.md`,
  `docs/DEPLOYMENT.md` e `docs/SECURITY_CHECKLIST.md`.

## Conteudo minimo por novidade

Cada atualizacao deve responder:

- O que mudou.
- Quem pode usar.
- Quais empresas/dados sao afetados.
- Se a funcionalidade usa dados reais ou demonstrativos.
- Quais cuidados de seguranca ou operacao existem.

## Estado atual

- Login, 2FA, RBAC, troca de senha e administracao de usuarios estao ativos.
- Banco PostgreSQL esta em producao no Coolify.
- Dashboards ainda usam dados demonstrativos filtrados por permissao.
- Asaas e Conta Azul aparecem como status operacional, mas a sincronizacao real
  ainda depende da implementacao dos conectores e credenciais.
