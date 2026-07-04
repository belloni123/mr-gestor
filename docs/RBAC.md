# RBAC e acesso por empresa

## Papeis

### SUPER_ADMIN

Permissoes:

- Ver todas as empresas cadastradas.
- Criar usuarios.
- Resetar senha inicial de usuarios.
- Ativar/desativar usuarios.
- Alterar empresas vinculadas a usuarios.
- Acessar o painel `/admin/users`.

### EDITOR

Permissoes:

- Ver dashboards somente das empresas vinculadas.
- Editar dados futuros das empresas vinculadas.
- Trocar a propria senha em `/account/security`.

Restricoes:

- Nao acessa `/admin/users`.
- Nao cria usuario.
- Nao altera permissao de outros usuarios.
- Nao recebe dados de empresas nao vinculadas no payload do dashboard.

## Empresas iniciais

- `b16`: Agencia B16
- `maestro`: Maestro Tiago Santos

O seed cria as empresas se ainda nao existirem.

## Fluxo de primeiro acesso

1. Super admin/editor e criado por seed ou painel admin.
2. Usuario entra com senha temporaria.
3. Sistema exige setup de 2FA TOTP.
4. Sistema exige troca da senha inicial.
5. Usuario passa a acessar somente o que seu papel permite.

## Matriz resumida

| Acao | SUPER_ADMIN | EDITOR |
| --- | --- | --- |
| Ver todas as empresas | Sim | Nao |
| Ver empresa vinculada | Sim | Sim |
| Criar usuario | Sim | Nao |
| Resetar senha de outro usuario | Sim | Nao |
| Alterar propria senha | Sim | Sim |
| Alterar empresas permitidas | Sim | Nao |
| Acessar admin | Sim | Nao |
