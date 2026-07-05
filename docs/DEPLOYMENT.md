# Deploy no Coolify

## Pré-requisitos

- Projeto Next.js apontando para este repositório.
- Banco PostgreSQL criado no Coolify ou externo.
- Domínio `gestao.nofrontscale.com.br` apontando para o proxy do Coolify.
- HTTPS ativo.

## Variáveis obrigatórias

Configurar no Coolify, nunca no Git:

```txt
DATABASE_URL
SESSION_SECRET
APP_ENCRYPTION_KEY
APP_URL
BOOTSTRAP_SUPER_ADMIN_EMAIL
BOOTSTRAP_SUPER_ADMIN_NAME
BOOTSTRAP_SUPER_ADMIN_PASSWORD
BOOTSTRAP_EDITOR_EMAIL
BOOTSTRAP_EDITOR_NAME
BOOTSTRAP_EDITOR_PASSWORD
BOOTSTRAP_EDITOR_COMPANIES
```

As variáveis de editor são opcionais. `BOOTSTRAP_SUPER_ADMIN_PASSWORD` e
`BOOTSTRAP_EDITOR_PASSWORD` só precisam existir para criar usuários bootstrap
novos; depois disso, o seed não regrava senhas existentes.

Gerar segredos:

```bash
npm run security:secrets
```

## Primeiro deploy

1. Configurar variáveis no Coolify.
2. Deployar a imagem Docker.
3. O container executa automaticamente `npm run db:push && npm run db:seed`
   antes de iniciar o servidor.
4. Entrar com o super admin.
5. Configurar 2FA.
6. Trocar a senha temporária.
7. Remover ou rotacionar senhas bootstrap do ambiente se não forem mais necessárias.

## Deploy recorrente

```bash
npm run db:generate
npm run lint
npm run build
npm audit --audit-level=moderate
```

Depois fazer commit, push e acionar redeploy no Coolify.

## Cuidados

- Não logar senhas ou tokens.
- Não imprimir `.env`.
- Fazer backup do banco antes de mudanças destrutivas.
- Para repositório privado no futuro, configurar GitHub App/deploy key no Coolify antes de tornar privado.
- Se `APP_ENCRYPTION_KEY` for trocada sem migração, os segredos TOTP existentes não poderão ser descriptografados.
