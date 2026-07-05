# Security checklist

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
