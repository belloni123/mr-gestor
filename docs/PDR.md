# PDR - MR Gestor

## Objetivo

O MR Gestor é um hub interno de gestão e controladoria para a NoFront Scale,
com acesso seguro por cliente/empresa, dashboards financeiros e operacionais,
e base preparada para integrações com Asaas e Conta Azul.

O produto não nasce como SaaS público. Ele deve atender a operação interna e
clientes autorizados, com isolamento forte de dados por empresa e uma visão
consolidada configurável pelo super admin.

## Referências e benchmark

- Demo base: Hub Estratégico MR Cont, usado como referência funcional para o
  hub de controladoria e navegação entre visões.
- Apple DesignMD: referencia visual para superfícies limpas, hierarquia clara,
  tipografia de sistema, action blue, pouco ruído visual e foco no conteúdo.
- Asaas: webhooks e eventos de pagamento como caminho principal para manter
  status financeiro sincronizado.
- Conta Azul: API pública para sincronizar dados financeiros, vendas, clientes,
  fornecedores, produtos e notas fiscais.
- Estratégia técnica das integrações: ver [INTEGRATIONS.md](INTEGRATIONS.md).
- OWASP e NIST: autenticação, MFA, sessão segura, controle de acesso e redução
  de vazamento de informações.

Links:

- https://martinsromeromrcont.github.io/apresentaçãonofront-controladoria/Hub_Estrategico_DEMO.html
- https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/apple/DESIGN.md
- https://docs.asaas.com/docs/payment-events
- https://developers.contaazul.com/aboutapis
- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://csrc.nist.gov/pubs/sp/800/63/b/upd2/final

## Perfis de acesso

Super admin:

- Acessa todas as empresas.
- Cria, edita e desativa usuários.
- Define quais empresas cada editor pode acessar.
- Visualiza dashboards individuais e consolidados.

Editor:

- Acessa somente empresas explicitamente vinculadas.
- Visualiza os dados autorizados.
- Pode trocar a própria senha.
- Não administra usuários nem acessa empresas fora do vínculo.

Perfil futuro recomendado:

- Viewer/Cliente: somente leitura, sem permissões de edição operacional.

## Requisitos funcionais

- Login com senha e MFA obrigatório.
- Cadastro e gestão de usuários por papel.
- Cadastro lógico de empresas.
- Isolamento de payload por empresa no servidor.
- Dashboards por empresa.
- Dashboard consolidado com seletor de empresas.
- Possibilidade de selecionar todas, algumas ou uma empresa para consolidação.
- Base para integrações Asaas e Conta Azul.
- Auditoria de eventos sensíveis.
- Interface responsiva para uso em celular.

## Requisitos não funcionais

- Não versionar `.env` nem segredos.
- Usar cookies httpOnly, secure em produção e SameSite.
- Usar lockout temporário contra tentativa de senha.
- Não retornar mensagens de login que revelem se o usuário existe.
- Manter headers de segurança em produção.
- Evitar que editores recebam dados de empresas não autorizadas no HTML/JSON.
- Fazer deploy via Docker no Coolify.
- Manter README, checklist de segurança, RBAC e deploy atualizados.
- Atualizar a Central de Ajuda a cada nova funcionalidade, inteligência,
  integração, automação, regra de acesso ou mudança operacional relevante.

## Entregue nesta versão

- Módulos de uso diário e estratégia inspirados no Hub Estratégico de
  referência: Meu dia, Estratégia, Cronograma (Gantt), CRM & Vendas,
  Marketing e Departamentos — todos com dados demonstrativos e navegação
  agrupada.
- CRM filtrado no servidor pelas empresas autorizadas de cada usuário.
- Busca rápida funcional sobre os módulos do hub.
- Limite de tentativas no 2FA (5 códigos incorretos encerram a sessão de
  verificação).
- Invalidação de sessões após troca de senha ou desativação de usuário
  (verificação de `passwordVersion` e `isActive` no servidor).
- Proxy de borda que redireciona visitantes sem cookie de sessão para o login.
- CSP sem `unsafe-eval` em produção e bloqueio de indexação
  (`robots.txt`, metadata e `X-Robots-Tag`).
- Autenticação com senha, sessão segura e MFA TOTP.
- Super admin inicial criado por seed.
- Seed idempotente que não regrava senha em redeploy.
- Remoção da senha bootstrap do Coolify após criação do usuário.
- RBAC para super admin e editor.
- Admin de usuários em `/admin/users`.
- Página de troca de senha em `/account/security`.
- Empresas iniciais: Agência B16 e Maestro Tiago Santos.
- Dashboard demo filtrado no servidor por permissões.
- Dockerfile preparado para rodar Prisma schema push e seed antes do servidor.
- PostgreSQL criado e conectado no Coolify.
- Deploy em `https://gestao.nofrontscale.com.br`.

## Roadmap recomendado

Fase 1 - Dados reais:

- Criar tabelas de integração por provedor.
- Implementar webhooks Asaas para pagamentos.
- Implementar OAuth Conta Azul por empresa e polling recorrente, já que a API
  ainda não oferece webhooks nativos.
- Implementar cadastro criptografado de API key Asaas por empresa e ambiente.
- Criar jobs de sincronização e reconciliação.
- Registrar origem, data de coleta e último status de cada dado.

Fase 2 - Dashboards:

- Separar receitas, despesas, inadimplência, fluxo de caixa e margem.
- Criar comparativo mensal e anual.
- Adicionar filtros por período, empresa, categoria e centro de custo.
- Criar visual consolidado com checkboxes de empresas.
- Permitir exportação de relatórios.

Fase 3 - Operação segura:

- Tela de auditoria para super admin.
- Backup e rotina de restore testada.
- Rotação documentada de segredos.
- Política de usuários inativos.
- Perfil Viewer para clientes com acesso somente leitura.

## Critérios de aceite

- Usuário sem sessão sempre redireciona para `/login`.
- Login válido sempre exige MFA antes do dashboard.
- Primeiro acesso exige configuração de 2FA.
- Dashboard mostra uma Central de Ajuda com orientações de primeiro acesso e
  status das integrações.
- Usuário com `mustChangePassword` é redirecionado para troca de senha.
- Editor não recebe dados de empresas fora do vínculo.
- Super admin consegue criar usuário e alterar empresas permitidas.
- Login mobile em 390px não tem overflow horizontal.
- Headers de segurança estão presentes em produção.
- Nenhum arquivo `.env` real está versionado.
