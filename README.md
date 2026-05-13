# FieldVerify API

FieldVerify é uma aplicação desenvolvida para gerenciar fluxos de auditoria em campo e prevenção à fraude em processos de credenciamento B2B.

# Tecnologias
- Node.js
- Fastify
- TypeScript
- ORM Prisma
- PostgreSQL (Docker)
- Zod
- tsup & tsx (build)

## RFs (Requisitos funcionais)

### Gestão de acesso

- [ ] Cadastro de Usuários: Deve ser possível cadastrar agentes e supervisores;
- [ ] Autenticação: Deve ser possível se autenticar via email e senha (JWT);
- [ ] Verificação de Identidade: Deve ser possível verificar o email do usuário via token;
- [ ] Recuperação de Senha: Deve ser possível solicitar a alteração de senha via email;
- [ ] Perfil: Deve ser possível obter o perfil do usuário logado;

### Operações de campo

- [ ] Busca por Proximidade: Deve ser possível buscar lojistas próximos (até 10km);
- [ ] Busca por Dados: Deve ser possível buscar lojistas por nome ou CNPJ;
- [ ] Check-in de Auditoria: Deve ser possível realizar o check-in ao chegar em um lojista;
- [ ] Validação: Deve ser possível concluir uma auditoria após o período mínimo de permanência;
- [ ] Histórico: Deve ser possível obter o histórico de auditorias realizadas pelo agente.

### Administrativo

- [ ] Gestão de Lojistas: Deve ser possível cadastrar e editar lojistas para a fila de auditoria;
- [ ] Monitoramento: Supervisores devem poder visualizar auditorias suspeitas de fraude.

## RNs (Regras de Negócio)

- [ ] E-mail Único: O usuário não deve poder se cadastrar com um e-mail duplicado;
- [ ] Verificação obrigatória: O agente só pode iniciar auditorias se o seu email estiver verificado;
- [ ] Limite Diário: O agente não pode realizar duas auditorias no mesmo lojista no mesmo dia;
- [ ] Trava de Distância: O agente não pode iniciar a auditoria se o seu GPS atual estiver a mais de 100m do estabelecimento cadastrado;
- [ ] Trava de Tempo: A auditoria só pode ser validada/concluída em até 20 minutos após o início do check-in;
- [ ] Nível de Acesso: Cadastro de lojistas e alteração de status de auditoria (Aprovar/Rejeitar) são exclusivos de administradores;
- [ ] Imutabilidade: Uma auditoria concluída ou rejeitada não pode ter seus status de geolocalização alterados.

## RNFs (Requisitos não-funcionais)

- [ ] Criptografia: As senhas devem ser persistidas utilizando BcryptJS;
- [ ] Persistência: Os dados devem ser armazenados em um banco PostgreSQL;
- [ ] Escalabilidade: Listagem de lojistas e auditorias devem ser paginadas (20 itens por página);
- [ ] Segurança: O usuário deve ser identificado por um JWT (JSON Web Token) com Refresh Token;
- [ ] Rastreabilidade: Todas as tabelas devem possuir registros automáticos de data de criação e última atualização (`created_at`, `updated_at`).

# Como rodar a aplicação

```bash
# Instalar dependências
npm install

# Subir o banco de dados
docker-compose up -d

# Executar migrações do banco
npm run prisma:migrate -- --name initial_schema

# Rodar em modo dev
npm run start:dev
```