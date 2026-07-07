# Integrações - Conta Azul e Asaas

Última revisão: 2026-07-07.

Este documento consolida a leitura inicial das documentações oficiais da Conta
Azul e do Asaas para orientar a implementação das integrações reais no MR
Gestor. Ele deve ser atualizado sempre que houver mudança de API, novo fluxo de
sincronização, nova credencial, novo webhook ou alteração operacional relevante.

## Objetivo no MR Gestor

- Conectar cada empresa cadastrada aos seus provedores financeiros.
- Manter dados isolados por empresa.
- Permitir dashboard individual e consolidado por seleção de empresas.
- Registrar origem, horário, status e rastreabilidade de cada dado importado.
- Proteger tokens, chaves de API e dados financeiros sensíveis.

## Conta Azul

Fontes oficiais estudadas:

- https://developers.contaazul.com/introduction.md
- https://developers.contaazul.com/requestingcode
- https://developers.contaazul.com/authorize-multiple-clients
- https://developers.contaazul.com/renewingaccesstoken
- https://developers.contaazul.com/minimumrequirements
- https://developers.contaazul.com/aboutapis
- https://developers.contaazul.com/faq
- https://developers.contaazul.com/commonmistakes

### Capacidades relevantes

A API da Conta Azul é REST, usa JSON e OAuth 2.0. As áreas documentadas cobrem
gestão financeira, clientes, fornecedores, produtos, serviços, vendas,
orçamentos, contratos, categorias, centros de custo e notas fiscais.

Para o MR Gestor, os primeiros blocos de maior valor são:

- Contas a receber e baixas.
- Contas a pagar e despesas.
- Clientes e fornecedores.
- Vendas e serviços.
- Categorias financeiras e centros de custo.
- Notas fiscais quando forem relevantes para conciliação e controladoria.

### Autenticação e multiempresa

- A conexão é feita por OAuth 2.0.
- Cada empresa/cliente precisa passar pelo fluxo de autorização individual.
- Cada autorização gera tokens específicos para aquela empresa Conta Azul.
- O `authorization_code` tem validade curta; a FAQ informa validade de 3
  minutos.
- A troca de token usa autenticação Basic baseada em
  `BASE64(client_id:client_secret)` no endpoint de token.

Implicação para o MR Gestor:

- A tela de empresa deve ter uma ação "Conectar Conta Azul".
- A conexão deve salvar tokens criptografados por empresa.
- O refresh token deve ser tratado no servidor, nunca no navegador.
- Uma falha `invalid_grant` deve marcar a conexão como "reautorização
  necessária".

### OAuth implementado no MR Gestor

Implementado em 2026-07-07:

- Botão "Conectar Conta Azul" em cada empresa cadastrada.
- Rota `POST /api/integrations/conta-azul/connect` para iniciar a autorização.
- Rota `GET /api/integrations/conta-azul/callback` para receber `code` e
  `state`.
- Validação de `state` na sessão para reduzir risco de CSRF.
- Troca do `authorization_code` por `access_token` e `refresh_token` no
  endpoint oficial `https://auth.contaazul.com/oauth2/token`.
- Armazenamento criptografado por empresa em `CompanyIntegrationCredential`.
- Auditoria da conexão sem registrar token, refresh token, `client_id` ou
  `client_secret`.

Variáveis necessárias em produção:

- `CONTA_AZUL_CLIENT_ID`
- `CONTA_AZUL_CLIENT_SECRET`
- `CONTA_AZUL_REDIRECT_URI`
- `CONTA_AZUL_ENVIRONMENT`

URL de callback atual:

`https://gestao.nofrontscale.com.br/api/integrations/conta-azul/callback`

### Sincronização

A documentação informa que a Conta Azul ainda não oferece webhooks nativos.
Portanto, a sincronização deve usar polling recorrente.

Fluxo recomendado:

1. Super admin conecta a empresa via OAuth.
2. MR Gestor executa uma sincronização inicial por período configurado.
3. Jobs recorrentes consultam alterações por página usando `page` e `size`.
4. Dados normalizados entram em tabelas internas do MR Gestor.
5. Dashboards leem apenas as tabelas internas, não a API externa em tempo real.
6. Se a API retornar `401`, tentar refresh; se falhar, pedir reautorização.
7. Se a API retornar `429`, aplicar backoff exponencial e reduzir concorrência.

### Limites e erros relevantes

- Limite informado: 600 chamadas por minuto e 10 chamadas por segundo por conta
  conectada do ERP.
- Erros esperados: `invalid_grant`, `401 Unauthorized`, `429 Too Many Requests`
  e `500 Internal Server Error`.
- Não há sandbox dedicado; para testes, a Conta Azul fornece uma Conta de
  Desenvolvimento por período limitado.
- Não há SDK oficial; a integração deve ser HTTP + JSON.

## Asaas

Fontes oficiais estudadas:

- https://docs.asaas.com/llms.txt
- https://docs.asaas.com/reference/comece-por-aqui.md
- https://docs.asaas.com/docs/authentication.md
- https://docs.asaas.com/docs/payments-overview.md
- https://docs.asaas.com/docs/customers.md
- https://docs.asaas.com/docs/about-webhooks.md
- https://docs.asaas.com/docs/receive-asaas-events-at-your-webhook-endpoint.md
- https://docs.asaas.com/docs/api-limits-1.md
- https://docs.asaas.com/docs/security.md

### Ambientes

- Produção: `https://api.asaas.com/`
- Sandbox: `https://api-sandbox.asaas.com/`

A documentação interativa usa Sandbox. Se uma chave de produção for usada nos
testes da documentação, a resposta esperada é `401 Unauthorized`.

### Autenticação

- O Asaas usa API key.
- A chave é gerada na interface web em Integrations > API Key.
- A chave só é exibida no momento de geração; se for perdida, deve ser gerada
  uma nova.
- Uma conta pode ter até 10 API keys.
- A documentação orienta armazenar a chave em cofre de segredos e nunca deixar
  direto no código fonte.
- O header de autenticação esperado é `access_token`.

Implicação para o MR Gestor:

- A API key deve ser salva criptografada e associada a uma empresa.
- Devem existir campos separados para ambiente `sandbox` e `production`.
- O sistema deve validar conectividade sem imprimir a chave em logs.
- A chave deve poder ser rotacionada por empresa.

### Clientes e cobranças

Para criar cobranças no Asaas, primeiro é necessário criar ou localizar o
cliente, obtendo o `customer id`. Depois disso, o MR Gestor poderá criar ou
consultar cobranças nos formatos relevantes:

- Pix.
- Boleto.
- Cartão de crédito.
- Link de pagamento.
- Assinaturas/recorrências, se entrarem no escopo futuro.

Para dashboards, a primeira fase deve focar em leitura e conciliação de
cobranças, não em criação ativa de novas cobranças, até que as regras
operacionais estejam validadas.

### Webhooks

O Asaas oferece webhooks para manter o sistema atualizado. A documentação
descreve que eventos sao enviados por `POST` para a URL configurada.

Boas práticas obrigatórias:

- Configurar apenas eventos necessários.
- Tratar entrega "at least once" com idempotência.
- Processar eventos de forma assíncrona.
- Retornar HTTP `200` rapidamente.
- Validar o header `asaas-access-token`.
- Usar um token forte no webhook, diferente da API key.
- Em produção, usar endpoint HTTPS.
- Considerar allowlist dos IPs oficiais do Asaas no firewall.

Pontos operacionais importantes:

- É possível configurar até 10 URLs de webhook.
- Se o endpoint falhar 15 vezes consecutivas, a fila de sincronização pode ser
  interrompida.
- Eventos parados por mais de 14 dias podem ser excluídos permanentemente.

### Limites

- Até 50 requisições GET concorrentes.
- Quota de 25.000 requisições por conta a cada 12 horas.
- Alguns endpoints tem rate limit próprio.
- Headers como `RateLimit-Limit`, `RateLimit-Remaining` e `RateLimit-Reset`
  devem orientar backoff e concorrência.

## Modelo atual de dados

Implementado em 2026-07-07:

- `Company`
  - `code`: código interno único usado para conciliação e identificação operacional.
  - `integrationTokenEncrypted`: token interno criptografado por empresa.
  - `integrationTokenLastFour`: apenas os quatro últimos caracteres para conferência visual.
  - `integrationTokenUpdatedAt`: data da última geração/rotação do token.

- `CompanyIntegrationCredential`
  - `companyId`
  - `provider`: `ASAAS` ou `CONTA_AZUL`
  - `environment`: `SANDBOX` ou `PRODUCTION`
  - `credentialEncrypted`: API key, access token ou token primário criptografado.
  - `credentialLastFour`: apenas os quatro últimos caracteres para conferência visual.
  - `refreshEncrypted`: refresh token criptografado quando o provedor exigir.
  - `refreshLastFour`: apenas os quatro últimos caracteres do refresh token.
  - `externalAccountId`: identificador externo/tenant quando existir.
  - `status`: `PENDING`, `READY`, `CONNECTED` ou `ERROR`.
  - `lastSyncedAt`

As credenciais são cadastradas pelo super admin em `/companies`. Tokens reais
nunca devem aparecer no HTML depois de salvos; quando o sistema gera token
interno automaticamente, ele é exibido apenas uma vez.

Tabelas recomendadas para a próxima fase de dados reais:

- `IntegrationConnection`
  - Pode evoluir ou substituir `CompanyIntegrationCredential` se precisarmos
    guardar escopos, erros detalhados e múltiplas conexões por empresa/provedor.
  - `scopes`
  - `lastSyncedAt`
  - `lastError`

- `ExternalEntityMap`
  - `companyId`
  - `provider`
  - `externalId`
  - `entityType`
  - `internalId`
  - `lastSeenAt`

- `SyncRun`
  - `companyId`
  - `provider`
  - `status`
  - `startedAt`
  - `finishedAt`
  - `recordsRead`
  - `recordsChanged`
  - `errorSummary`

- `WebhookEvent`
  - `provider`
  - `eventId`
  - `companyId`
  - `eventType`
  - `payloadHash`
  - `receivedAt`
  - `processedAt`
  - `status`

- `FinancialTransaction`
  - `companyId`
  - `sourceProvider`
  - `sourceExternalId`
  - `type`: receita, despesa, transferencia, ajuste
  - `status`
  - `dueDate`
  - `paymentDate`
  - `amount`
  - `category`
  - `costCenter`

## Arquitetura de sincronização

Fluxo Asaas:

1. Super admin cadastra API key por empresa.
2. Sistema valida ambiente e conectividade.
3. Sistema registra webhook no Asaas ou orienta configuração manual.
4. Webhook recebe evento, valida token e grava `WebhookEvent`.
5. Worker processa evento e atualiza tabelas internas.
6. Job de reconciliação periodico consulta API para corrigir divergencias.

Fluxo Conta Azul:

1. Super admin inicia OAuth por empresa.
2. Callback salva tokens criptografados.
3. Job inicial importa dados históricos configurados.
4. Polling incremental atualiza dados recorrentes.
5. Rate limit e erros atualizam status da conexão.

## Segurança obrigatória

- Nunca salvar API keys, access tokens ou refresh tokens em texto puro.
- Nunca expor credenciais em HTML, payloads do cliente ou logs.
- Usar `APP_ENCRYPTION_KEY` para criptografia em repouso.
- Usar HTTPS em todos os callbacks e webhooks.
- Validar permissão por empresa antes de exibir qualquer dado sincronizado.
- Registrar auditoria para conectar, desconectar, rotacionar chave e alterar
  ambiente.
- Usar idempotência em webhooks e jobs.
- Implementar backoff para `429` e retentativas controladas para `5xx`.
- Separar credenciais de Sandbox/Desenvolvimento e Produção.

## Primeira entrega recomendada

- Cadastrar empresas reais pelo painel.
- Definir `code` único para cada empresa.
- Gerar ou informar token interno por empresa.
- Cadastrar credenciais de Sandbox primeiro.
- Implementar fluxo OAuth da Conta Azul por empresa.
- Implementar teste de conectividade sem imprimir tokens.
- Criar tabelas normalizadas para dados financeiros antes de alimentar dashboards.

1. Criar tabelas de conexão, eventos e sync runs.
2. Criar tela de Integrações por empresa para super admin.
3. Implementar cadastro criptografado de API key Asaas em Sandbox.
4. Criar endpoint seguro de webhook Asaas.
5. Criar worker de processamento idempotente.
6. Implementar OAuth Conta Azul em ambiente de desenvolvimento.
7. Criar job de polling Conta Azul.
8. Atualizar dashboards para indicar dado demonstrativo, sincronizado,
   desatualizado ou com erro.

## Perguntas em aberto

- Quais contas Asaas serão conectadas primeiro: Agência B16, Maestro Tiago
  Santos ou ambas?
- O MR Gestor deve apenas ler cobranças ou também criar cobranças no Asaas?
- Qual período histórico inicial deve ser importado: 90 dias, ano corrente ou
  tudo disponível?
- Quais categorias e centros de custo serão padrão entre empresas para o
  dashboard consolidado?
- Quem será responsavel por aprovar rotação de chaves e reautorizações?
