# PDR - MR Gestor

## Objetivo

O MR Gestor e um hub interno de gestao e controladoria para a NoFront Scale,
com acesso seguro por cliente/empresa, dashboards financeiros e operacionais,
e base preparada para integracoes com Asaas e Conta Azul.

O produto nao nasce como SaaS publico. Ele deve atender a operacao interna e
clientes autorizados, com isolamento forte de dados por empresa e uma visao
consolidada configuravel pelo super admin.

## Referencias e benchmark

- Demo base: Hub Estrategico MR Cont, usado como referencia funcional para o
  hub de controladoria e navegacao entre visoes.
- Apple DesignMD: referencia visual para superficies limpas, hierarquia clara,
  tipografia de sistema, action blue, pouco ruido visual e foco no conteudo.
- Asaas: webhooks e eventos de pagamento como caminho principal para manter
  status financeiro sincronizado.
- Conta Azul: API publica para sincronizar dados financeiros, vendas, clientes,
  fornecedores, produtos e notas fiscais.
- OWASP e NIST: autenticacao, MFA, sessao segura, controle de acesso e reducao
  de vazamento de informacoes.

Links:

- https://martinsromeromrcont.github.io/apresentacaonofront-controladoria/Hub_Estrategico_DEMO.html
- https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/apple/DESIGN.md
- https://docs.asaas.com/docs/payment-events
- https://developers.contaazul.com/aboutapis
- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://csrc.nist.gov/pubs/sp/800/63/b/upd2/final

## Perfis de acesso

Super admin:

- Acessa todas as empresas.
- Cria, edita e desativa usuarios.
- Define quais empresas cada editor pode acessar.
- Visualiza dashboards individuais e consolidados.

Editor:

- Acessa somente empresas explicitamente vinculadas.
- Visualiza os dados autorizados.
- Pode trocar a propria senha.
- Nao administra usuarios nem acessa empresas fora do vinculo.

Perfil futuro recomendado:

- Viewer/Cliente: somente leitura, sem permissoes de edicao operacional.

## Requisitos funcionais

- Login com senha e MFA obrigatorio.
- Cadastro e gestao de usuarios por papel.
- Cadastro logico de empresas.
- Isolamento de payload por empresa no servidor.
- Dashboards por empresa.
- Dashboard consolidado com seletor de empresas.
- Possibilidade de selecionar todas, algumas ou uma empresa para consolidacao.
- Base para integracoes Asaas e Conta Azul.
- Auditoria de eventos sensiveis.
- Interface responsiva para uso em celular.

## Requisitos nao funcionais

- Nao versionar `.env` nem segredos.
- Usar cookies httpOnly, secure em producao e SameSite.
- Usar lockout temporario contra tentativa de senha.
- Nao retornar mensagens de login que revelem se o usuario existe.
- Manter headers de seguranca em producao.
- Evitar que editores recebam dados de empresas nao autorizadas no HTML/JSON.
- Fazer deploy via Docker no Coolify.
- Manter README, checklist de seguranca, RBAC e deploy atualizados.

## Entregue nesta versao

- Autenticacao com senha, sessao segura e MFA TOTP.
- Super admin inicial criado por seed.
- Seed idempotente que nao regrava senha em redeploy.
- Remocao da senha bootstrap do Coolify apos criacao do usuario.
- RBAC para super admin e editor.
- Admin de usuarios em `/admin/users`.
- Pagina de troca de senha em `/account/security`.
- Empresas iniciais: Agencia B16 e Maestro Tiago Santos.
- Dashboard demo filtrado no servidor por permissoes.
- Dockerfile preparado para rodar Prisma schema push e seed antes do servidor.
- PostgreSQL criado e conectado no Coolify.
- Deploy em `https://gestao.nofrontscale.com.br`.

## Roadmap recomendado

Fase 1 - Dados reais:

- Criar tabelas de integracao por provedor.
- Implementar webhooks Asaas para pagamentos.
- Implementar OAuth/credenciais Conta Azul conforme conta do cliente.
- Criar jobs de sincronizacao e reconciliacao.
- Registrar origem, data de coleta e ultimo status de cada dado.

Fase 2 - Dashboards:

- Separar receitas, despesas, inadimplencia, fluxo de caixa e margem.
- Criar comparativo mensal e anual.
- Adicionar filtros por periodo, empresa, categoria e centro de custo.
- Criar visual consolidado com checkboxes de empresas.
- Permitir exportacao de relatorios.

Fase 3 - Operacao segura:

- Tela de auditoria para super admin.
- Backup e rotina de restore testada.
- Rotacao documentada de segredos.
- Politica de usuarios inativos.
- Perfil Viewer para clientes com acesso somente leitura.

## Criterios de aceite

- Usuario sem sessao sempre redireciona para `/login`.
- Login valido sempre exige MFA antes do dashboard.
- Primeiro acesso exige configuracao de 2FA.
- Usuario com `mustChangePassword` e redirecionado para troca de senha.
- Editor nao recebe dados de empresas fora do vinculo.
- Super admin consegue criar usuario e alterar empresas permitidas.
- Login mobile em 390px nao tem overflow horizontal.
- Headers de seguranca estao presentes em producao.
- Nenhum arquivo `.env` real esta versionado.
