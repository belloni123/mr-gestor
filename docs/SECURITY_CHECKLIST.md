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
- [ ] Dominio correto.
- [ ] Seed rodado sem imprimir credenciais.
- [ ] Super admin configurou 2FA.
- [ ] Senhas temporarias foram trocadas.

## Operacao continua

- [ ] Revisar usuarios ativos mensalmente.
- [ ] Desativar usuarios sem necessidade de acesso.
- [ ] Revisar empresas vinculadas a editores.
- [ ] Rodar auditoria de dependencias antes de cada release.
- [ ] Rotacionar segredos se houver suspeita de vazamento.
- [ ] Manter backups do PostgreSQL.
