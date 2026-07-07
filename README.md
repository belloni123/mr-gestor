# MR Gestor

Hub interno de gestão, controladoria e dashboards multiempresa da NoFront Scale.

O projeto foi preparado para operar como portal sigiloso: login obrigatório, senha com hash forte, 2FA TOTP, sessões em cookie HTTP-only, RBAC por papel, permissão por empresa, auditoria e checklist de deploy.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Prisma ORM
- PostgreSQL
- `iron-session` para sessão HTTP-only
- `bcryptjs` para hash de senha
- `otplib` para 2FA TOTP
- Recharts e Lucide Icons
- Docker standalone para Coolify

## Modelo de acesso

- `SUPER_ADMIN`: pode ver todas as empresas, criar usuários, resetar senhas, ativar/desativar usuários e alterar empresas permitidas.
- `EDITOR`: pode acessar somente as empresas vinculadas a ele e trocar a própria senha.
- Todo usuário precisa concluir 2FA no primeiro acesso.
- Usuários criados por seed/admin entram com senha temporária e são obrigados a trocá-la.

## Empresas e integrações

- Empresas reais são cadastradas em `/companies` pelo super admin.
- Cada empresa tem `code` interno único e token interno criptografado.
- Credenciais de Asaas e Conta Azul são salvas por empresa, ambiente e provedor.
- Tokens já salvos aparecem apenas mascarados pelos quatro últimos caracteres.

Detalhes em [docs/RBAC.md](docs/RBAC.md).

O PDR do produto, benchmark e roadmap estão em [docs/PDR.md](docs/PDR.md).
As regras de manutenção da Central de Ajuda estão em [docs/HELP_CENTER.md](docs/HELP_CENTER.md).
A identidade visual e os SVGs da marca estão em [docs/BRAND.md](docs/BRAND.md).
A estratégia de integração com Conta Azul e Asaas está em [docs/INTEGRATIONS.md](docs/INTEGRATIONS.md).

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local
npm run security:secrets
```

Preencha `.env.local` com `DATABASE_URL`, `SESSION_SECRET`, `APP_ENCRYPTION_KEY` e os usuários bootstrap.

```bash
npm run db:push
npm run db:seed
npm run dev
```

Aplicação local: http://localhost:3000

## Validação

```bash
npm run db:generate
npm run lint
npm run build
npm audit --audit-level=moderate
```

## Deploy no Coolify

O projeto inclui `Dockerfile` com `next.config.ts` em modo `standalone`.

Domínio:

```txt
https://gestao.nofrontscale.com.br
```

Passos de produção em [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Segurança

Arquivos `.env`, `.env.local` e qualquer arquivo com segredo real não devem ser commitados. O repositório inclui apenas `.env.example`.

Documentação:

- [SECURITY.md](SECURITY.md)
- [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md)
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- [docs/RBAC.md](docs/RBAC.md)
- [docs/PDR.md](docs/PDR.md)
- [docs/HELP_CENTER.md](docs/HELP_CENTER.md)
- [docs/BRAND.md](docs/BRAND.md)
- [docs/INTEGRATIONS.md](docs/INTEGRATIONS.md)

Referências usadas:

- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- OWASP Session Management Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- OWASP Multifactor Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html
- NIST SP 800-63B: https://pages.nist.gov/800-63-4/sp800-63b.html
- Next.js Authentication docs: https://nextjs.org/docs/app/building-your-application/authentication
