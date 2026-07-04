# Integracoes - Conta Azul e Asaas

Ultima revisao: 2026-07-04.

Este documento consolida a leitura inicial das documentacoes oficiais da Conta
Azul e do Asaas para orientar a implementacao das integracoes reais no MR
Gestor. Ele deve ser atualizado sempre que houver mudanca de API, novo fluxo de
sincronizacao, nova credencial, novo webhook ou alteracao operacional relevante.

## Objetivo no MR Gestor

- Conectar cada empresa cadastrada aos seus provedores financeiros.
- Manter dados isolados por empresa.
- Permitir dashboard individual e consolidado por selecao de empresas.
- Registrar origem, horario, status e rastreabilidade de cada dado importado.
- Proteger tokens, chaves de API e dados financeiros sensiveis.

## Conta Azul

Fontes oficiais estudadas:

- https://developers.contaazul.com/introduction.md
- https://developers.contaazul.com/minimumrequirements
- https://developers.contaazul.com/aboutapis
- https://developers.contaazul.com/faq
- https://developers.contaazul.com/commonmistakes

### Capacidades relevantes

A API da Conta Azul e REST, usa JSON e OAuth 2.0. As areas documentadas cobrem
gestao financeira, clientes, fornecedores, produtos, servicos, vendas,
orcamentos, contratos, categorias, centros de custo e notas fiscais.

Para o MR Gestor, os primeiros blocos de maior valor sao:

- Contas a receber e baixas.
- Contas a pagar e despesas.
- Clientes e fornecedores.
- Vendas e servicos.
- Categorias financeiras e centros de custo.
- Notas fiscais quando forem relevantes para conciliacao e controladoria.

### Autenticacao e multiempresa

- A conexao e feita por OAuth 2.0.
- Cada empresa/cliente precisa passar pelo fluxo de autorizacao individual.
- Cada autorizacao gera tokens especificos para aquela empresa Conta Azul.
- O `authorization_code` tem validade curta; a FAQ informa validade de 3
  minutos.
- A troca de token usa autenticacao Basic baseada em
  `BASE64(client_id:client_secret)` no endpoint de token.

Implicacao para o MR Gestor:

- A tela de empresa deve ter uma acao "Conectar Conta Azul".
- A conexao deve salvar tokens criptografados por empresa.
- O refresh token deve ser tratado no servidor, nunca no navegador.
- Uma falha `invalid_grant` deve marcar a conexao como "reautorizacao
  necessaria".

### Sincronizacao

A documentacao informa que a Conta Azul ainda nao oferece webhooks nativos.
Portanto, a sincronizacao deve usar polling recorrente.

Fluxo recomendado:

1. Super admin conecta a empresa via OAuth.
2. MR Gestor executa uma sincronizacao inicial por periodo configurado.
3. Jobs recorrentes consultam alteracoes por pagina usando `page` e `size`.
4. Dados normalizados entram em tabelas internas do MR Gestor.
5. Dashboards leem apenas as tabelas internas, nao a API externa em tempo real.
6. Se a API retornar `401`, tentar refresh; se falhar, pedir reautorizacao.
7. Se a API retornar `429`, aplicar backoff exponencial e reduzir concorrencia.

### Limites e erros relevantes

- Limite informado: 600 chamadas por minuto e 10 chamadas por segundo por conta
  conectada do ERP.
- Erros esperados: `invalid_grant`, `401 Unauthorized`, `429 Too Many Requests`
  e `500 Internal Server Error`.
- Nao ha sandbox dedicado; para testes, a Conta Azul fornece uma Conta de
  Desenvolvimento por periodo limitado.
- Nao ha SDK oficial; a integracao deve ser HTTP + JSON.

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

- Producao: `https://api.asaas.com/`
- Sandbox: `https://api-sandbox.asaas.com/`

A documentacao interativa usa Sandbox. Se uma chave de producao for usada nos
testes da documentacao, a resposta esperada e `401 Unauthorized`.

### Autenticacao

- O Asaas usa API key.
- A chave e gerada na interface web em Integrations > API Key.
- A chave so e exibida no momento de geracao; se for perdida, deve ser gerada
  uma nova.
- Uma conta pode ter ate 10 API keys.
- A documentacao orienta armazenar a chave em cofre de segredos e nunca deixar
  direto no codigo fonte.
- O header de autenticacao esperado e `access_token`.

Implicacao para o MR Gestor:

- A API key deve ser salva criptografada e associada a uma empresa.
- Devem existir campos separados para ambiente `sandbox` e `production`.
- O sistema deve validar conectividade sem imprimir a chave em logs.
- A chave deve poder ser rotacionada por empresa.

### Clientes e cobrancas

Para criar cobrancas no Asaas, primeiro e necessario criar ou localizar o
cliente, obtendo o `customer id`. Depois disso, o MR Gestor podera criar ou
consultar cobrancas nos formatos relevantes:

- Pix.
- Boleto.
- Cartao de credito.
- Link de pagamento.
- Assinaturas/recorrencias, se entrarem no escopo futuro.

Para dashboards, a primeira fase deve focar em leitura e conciliacao de
cobrancas, nao em criacao ativa de novas cobrancas, ate que as regras
operacionais estejam validadas.

### Webhooks

O Asaas oferece webhooks para manter o sistema atualizado. A documentacao
descreve que eventos sao enviados por `POST` para a URL configurada.

Boas praticas obrigatorias:

- Configurar apenas eventos necessarios.
- Tratar entrega "at least once" com idempotencia.
- Processar eventos de forma assincrona.
- Retornar HTTP `200` rapidamente.
- Validar o header `asaas-access-token`.
- Usar um token forte no webhook, diferente da API key.
- Em producao, usar endpoint HTTPS.
- Considerar allowlist dos IPs oficiais do Asaas no firewall.

Pontos operacionais importantes:

- E possivel configurar ate 10 URLs de webhook.
- Se o endpoint falhar 15 vezes consecutivas, a fila de sincronizacao pode ser
  interrompida.
- Eventos parados por mais de 14 dias podem ser excluidos permanentemente.

### Limites

- Ate 50 requisicoes GET concorrentes.
- Quota de 25.000 requisicoes por conta a cada 12 horas.
- Alguns endpoints tem rate limit proprio.
- Headers como `RateLimit-Limit`, `RateLimit-Remaining` e `RateLimit-Reset`
  devem orientar backoff e concorrencia.

## Modelo recomendado de dados

Tabelas recomendadas para a fase de dados reais:

- `IntegrationConnection`
  - `companyId`
  - `provider`: `ASAAS` ou `CONTA_AZUL`
  - `environment`: `SANDBOX`, `DEVELOPMENT` ou `PRODUCTION`
  - `status`: `PENDING`, `CONNECTED`, `ERROR`, `REAUTH_REQUIRED`
  - `encryptedCredentials`
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

## Arquitetura de sincronizacao

Fluxo Asaas:

1. Super admin cadastra API key por empresa.
2. Sistema valida ambiente e conectividade.
3. Sistema registra webhook no Asaas ou orienta configuracao manual.
4. Webhook recebe evento, valida token e grava `WebhookEvent`.
5. Worker processa evento e atualiza tabelas internas.
6. Job de reconciliacao periodico consulta API para corrigir divergencias.

Fluxo Conta Azul:

1. Super admin inicia OAuth por empresa.
2. Callback salva tokens criptografados.
3. Job inicial importa dados historicos configurados.
4. Polling incremental atualiza dados recorrentes.
5. Rate limit e erros atualizam status da conexao.

## Seguranca obrigatoria

- Nunca salvar API keys, access tokens ou refresh tokens em texto puro.
- Nunca expor credenciais em HTML, payloads do cliente ou logs.
- Usar `APP_ENCRYPTION_KEY` para criptografia em repouso.
- Usar HTTPS em todos os callbacks e webhooks.
- Validar permissao por empresa antes de exibir qualquer dado sincronizado.
- Registrar auditoria para conectar, desconectar, rotacionar chave e alterar
  ambiente.
- Usar idempotencia em webhooks e jobs.
- Implementar backoff para `429` e retentativas controladas para `5xx`.
- Separar credenciais de Sandbox/Desenvolvimento e Producao.

## Primeira entrega recomendada

1. Criar tabelas de conexao, eventos e sync runs.
2. Criar tela de Integracoes por empresa para super admin.
3. Implementar cadastro criptografado de API key Asaas em Sandbox.
4. Criar endpoint seguro de webhook Asaas.
5. Criar worker de processamento idempotente.
6. Implementar OAuth Conta Azul em ambiente de desenvolvimento.
7. Criar job de polling Conta Azul.
8. Atualizar dashboards para indicar dado demonstrativo, sincronizado,
   desatualizado ou com erro.

## Perguntas em aberto

- Quais contas Asaas serao conectadas primeiro: Agencia B16, Maestro Tiago
  Santos ou ambas?
- O MR Gestor deve apenas ler cobrancas ou tambem criar cobrancas no Asaas?
- Qual periodo historico inicial deve ser importado: 90 dias, ano corrente ou
  tudo disponivel?
- Quais categorias e centros de custo serao padrao entre empresas para o
  dashboard consolidado?
- Quem sera responsavel por aprovar rotacao de chaves e reautorizacoes?
