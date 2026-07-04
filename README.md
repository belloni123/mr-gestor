# MR Gestor

Hub de gestao, controladoria e dashboards multiempresa da NoFront Scale.

## Stack

- Next.js 16
- React 19
- TypeScript
- Recharts
- Lucide Icons
- Docker standalone para Coolify

## Desenvolvimento

```bash
npm install
npm run dev
```

Aplicacao local: http://localhost:3000

## Validacao

```bash
npm run lint
npm run build
npm audit --audit-level=moderate
```

## Deploy

O projeto inclui `Dockerfile` com `next.config.ts` em modo `standalone`.

Dominio planejado:

```txt
https://gestao.nofrontscale.com.br
```
