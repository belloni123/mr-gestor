# Deploy no Coolify

## Pre-requisitos

- Projeto Next.js apontando para este repositorio.
- Banco PostgreSQL criado no Coolify ou externo.
- Dominio `gestao.nofrontscale.com.br` apontando para o proxy do Coolify.
- HTTPS ativo.

## Variaveis obrigatorias

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

As variaveis de editor sao opcionais. `BOOTSTRAP_SUPER_ADMIN_PASSWORD` e
`BOOTSTRAP_EDITOR_PASSWORD` so precisam existir para criar usuarios bootstrap
novos; depois disso, o seed nao regrava senhas existentes.

Gerar segredos:

```bash
npm run security:secrets
```

## Primeiro deploy

1. Configurar variaveis no Coolify.
2. Deployar a imagem Docker.
3. O container executa automaticamente `npm run db:push && npm run db:seed`
   antes de iniciar o servidor.
4. Entrar com o super admin.
5. Configurar 2FA.
6. Trocar a senha temporaria.
7. Remover ou rotacionar senhas bootstrap do ambiente se nao forem mais necessarias.

## Deploy recorrente

```bash
npm run db:generate
npm run lint
npm run build
npm audit --audit-level=moderate
```

Depois fazer commit, push e acionar redeploy no Coolify.

## Cuidados

- Nao logar senhas ou tokens.
- Nao imprimir `.env`.
- Fazer backup do banco antes de mudancas destrutivas.
- Para repositorio privado no futuro, configurar GitHub App/deploy key no Coolify antes de tornar privado.
- Se `APP_ENCRYPTION_KEY` for trocada sem migracao, os segredos TOTP existentes nao poderao ser descriptografados.
