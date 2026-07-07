# Security checklist

## Controles ativos no código

- [x] Sessão iron-session com cookie httpOnly, SameSite e secure em produção.
- [x] MFA TOTP obrigatório com segredo criptografado (AES-256-GCM).
- [x] Verificação de TOTP checa `result.valid === true`. O otplib v13 retorna
      um objeto (`{ valid, ... }`), então retornar o objeto direto tornaria
      qualquer código truthy e furaria o 2FA — regressão a evitar em upgrades.
- [x] Limite de 5 tentativas de código 2FA por sessão de verificação/setup.
- [x] Lockout temporário por usuário e limite de falhas por IP no login.
- [x] Sessões invalidadas após troca de senha (`passwordVersion`) ou
      desativação (`isActive`).
- [x] Proxy (`src/proxy.ts`) redireciona visitantes sem cookie de sessão.
- [x] CSP sem `unsafe-eval` em produção; headers de segurança no
      `next.config.ts`.
- [x] Bloqueio de indexação: `robots.txt`, metadata `noindex` e `X-Robots-Tag`.
- [x] Isolamento por empresa aplicado no servidor (dashboards e CRM).

## Antes do commit

- [ ] `git status --short` revisado.
- [ ] Nenhum `.env` aparece no status.
- [ ] Nenhum token, senha, chave ou dump aparece no diff.
- [ ] `npm run lint` passou.
- [ ] `npm run build` passou.
- [ ] `npm audit --audit-level=moderate` passou.

## Antes do deploy

- [ ] `DATABASE_URL` configurada somente no ambiente.
- [ ] `SESSION_SECRET` com pelo menos 32 caracteres.
- [ ] `APP_ENCRYPTION_KEY` gerada em base64 com 32 bytes.
- [ ] HTTPS ativo.
- [ ] Domínio correto.
- [ ] Seed rodado sem imprimir credenciais.
- [ ] Super admin configurou 2FA.
- [ ] Senhas temporárias foram trocadas.

## Operação continua

- [ ] Revisar usuários ativos mensalmente.
- [ ] Desativar usuários sem necessidade de acesso.
- [ ] Revisar empresas vinculadas a editores.
- [ ] Rodar auditoria de dependências antes de cada release.
- [ ] Rotacionar segredos se houver suspeita de vazamento.
- [ ] Manter backups do PostgreSQL.

## Integrações externas

- [ ] Criptografar API keys, access tokens e refresh tokens em repouso.
- [ ] Nunca imprimir credenciais de Asaas ou Conta Azul em logs.
- [ ] Separar credenciais de Sandbox/Desenvolvimento e Produção.
- [ ] Validar token de webhook Asaas pelo header `asaas-access-token`.
- [ ] Processar webhooks com idempotência.
- [ ] Retornar HTTP `200` rapidamente nos webhooks e processar em worker.
- [ ] Aplicar backoff para respostas `429`.
- [ ] Marcar Conta Azul como `REAUTH_REQUIRED` em falhas de refresh/OAuth.
- [ ] Auditar conexão, desconexão, rotação de chave e troca de ambiente.
