# MR Gestor

Hub interno de gestao, controladoria e dashboards multiempresa da NoFront Scale.

O projeto foi preparado para operar como portal sigiloso: login obrigatorio, senha com hash forte, 2FA TOTP, sessoes em cookie HTTP-only, RBAC por papel, permissao por empresa, auditoria e checklist de deploy.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL
- `iron-session` para sessao HTTP-only
- `bcryptjs` para hash de senha
- `otplib` para 2FA TOTP
- Recharts e Lucide Icons
- Docker standalone para Coolify

## Modelo de acesso

- `SUPER_ADMIN`: pode ver todas as empresas, criar usuarios, resetar senhas, ativar/desativar usuarios e alterar empresas permitidas.
- `EDITOR`: pode acessar somente as empresas vinculadas a ele e trocar a propria senha.
- Todo usuario precisa concluir 2FA no primeiro acesso.
- Usuarios criados por seed/admin entram com senha temporaria e sao obrigados a troca-la.

Detalhes em [docs/RBAC.md](docs/RBAC.md).

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local
npm run security:secrets
```

Preencha `.env.local` com `DATABASE_URL`, `SESSION_SECRET`, `APP_ENCRYPTION_KEY` e os usuarios bootstrap.

```bash
npm run db:push
npm run db:seed
npm run dev
```

Aplicacao local: http://localhost:3000

## Validacao

```bash
npm run db:generate
npm run lint
npm run build
npm audit --audit-level=moderate
```

## Deploy no Coolify

O projeto inclui `Dockerfile` com `next.config.ts` em modo `standalone`.

Dominio:

```txt
https://gestao.nofrontscale.com.br
```

Passos de producao em [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Seguranca

Arquivos `.env`, `.env.local` e qualquer arquivo com segredo real nao devem ser commitados. O repositorio inclui apenas `.env.example`.

Documentacao:

- [SECURITY.md](SECURITY.md)
- [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md)
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- [docs/RBAC.md](docs/RBAC.md)

Referencias usadas:

- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP Multifactor Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html
- NIST SP 800-63B: https://pages.nist.gov/800-63-4/sp800-63b.html
- Next.js Authentication docs: https://nextjs.org/docs/app/building-your-application/authentication
