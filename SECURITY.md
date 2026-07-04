# Security Policy

## Escopo

Este repositorio contem codigo do MR Gestor. Dados reais de clientes, tokens, chaves privadas, senhas, arquivos `.env` e backups de banco nao pertencem ao Git.

## Regras obrigatorias

- Nunca commitar `.env`, `.env.local`, dumps, certificados privados, tokens ou credenciais.
- Usar senhas temporarias apenas via variaveis de ambiente do Coolify.
- Trocar a senha temporaria no primeiro login.
- Manter 2FA ativo para todos os usuarios.
- Rodar `npm audit --audit-level=moderate` antes de deploy.
- Rodar `npm run lint` e `npm run build` antes de deploy.
- Se um segredo vazar, revogar imediatamente, gerar novo valor e registrar o incidente.

## Autenticacao

- Sessoes usam cookie HTTP-only com `Secure` em producao e `SameSite=Lax`.
- Senhas usam `bcrypt` com custo 12.
- O login bloqueia o usuario por 15 minutos apos tentativas falhas repetidas.
- O IP tambem e limitado por janela de tentativas falhas.
- O 2FA usa TOTP com janela curta.
- Segredos TOTP sao criptografados com AES-256-GCM usando `APP_ENCRYPTION_KEY`.

## Autorizacao

- O servidor decide quais empresas o usuario pode receber.
- Dados demo/financeiros ficam em modulo server-side e o navegador so recebe empresas autorizadas.
- `SUPER_ADMIN` ve tudo e administra usuarios.
- `EDITOR` ve somente as empresas vinculadas e pode trocar a propria senha.

## Headers de seguranca

Configurados em `next.config.ts`:

- `Content-Security-Policy`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`

## Resposta a incidente

1. Tirar o acesso do usuario/segredo afetado.
2. Rotacionar `SESSION_SECRET`, `APP_ENCRYPTION_KEY` se aplicavel, tokens e senhas.
3. Invalidar sessoes ativas.
4. Revisar `AuditLog` e `LoginAttempt`.
5. Registrar data, causa, impacto e correcao.

## Recomendacao para producao madura

Para um ambiente altamente regulado, considerar provedor dedicado de identidade como Clerk/Auth0/Descope com WebAuthn/passkeys, politicas de dispositivo e alertas avancados. O RBAC por empresa do MR Gestor pode continuar no banco da aplicacao.
