# RBAC e acesso por empresa

## Papéis

### SUPER_ADMIN

Permissões:

- Ver todas as empresas cadastradas.
- Criar usuários.
- Resetar senha inicial de usuários.
- Ativar/desativar usuários.
- Alterar empresas vinculadas a usuários.
- Acessar o painel `/admin/users`.

### EDITOR

Permissões:

- Ver dashboards somente das empresas vinculadas.
- Editar dados futuros das empresas vinculadas.
- Trocar a própria senha em `/account/security`.

Restrições:

- Não acessa `/admin/users`.
- Não cria usuário.
- Não altera permissão de outros usuários.
- Não recebe dados de empresas não vinculadas no payload do dashboard.

## Empresas iniciais

- `b16`: Agência B16
- `maestro`: Maestro Tiago Santos

O seed cria as empresas se ainda não existirem.

## Fluxo de primeiro acesso

1. Super admin/editor é criado por seed ou painel admin.
2. Usuário entra com senha temporária.
3. Sistema exige setup de 2FA TOTP.
4. Sistema exige troca da senha inicial.
5. Usuário passa a acessar somente o que seu papel permite.

## Matriz resumida

| Ação | SUPER_ADMIN | EDITOR |
| --- | --- | --- |
| Ver todas as empresas | Sim | Não |
| Ver empresa vinculada | Sim | Sim |
| Criar usuário | Sim | Não |
| Resetar senha de outro usuário | Sim | Não |
| Alterar própria senha | Sim | Sim |
| Alterar empresas permitidas | Sim | Não |
| Acessar admin | Sim | Não |
