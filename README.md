# FieldVerify API

FieldVerify é uma aplicação desenvolvida para gerenciar fluxos de auditoria em campo e prevenção à fraude em processos de credenciamento B2B. Ele foi desenvolvido para resolver um problema comum em fintechs e empresas de pagamento: o cadastro de lojstas que não existem (empresas de fachada, ou "lojistas fantasmas").

A ideia é simples: em vez de confiar apenas em documentos enviados pela internet, o sistema exige que vá um auditor/agente até o local. O app garante que o auditor realmente esteve lá e dedicou tempo para verificar o estabelecimento antes de liberarmos limites de crédito.

## Desafios técnicos

- **Validação de Localização (GPS):** Não adianta o agente dizer que está lá. O sistema faz um cálculo de geolocalização e só libera o início da auditoria se ele estiver a menos de 100 metros do endereço cadastrado.
- **Trava de Tempo Real:** Para evitar que alguém preencha tudo correndo sem olhar nada, implementei uma regra onde a auditoria só pode ser finalizada após 20 minutos de permanência no local.
- **Controle de Acesso (RBAC):** Separei o que um Agente (que faz a visita) pode fazer do que um Supervisor (que aprova os relatórios) pode ver.

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
- [ ] Evidência Fotográfica: O agente deve anexar ao menos 3 fotos (fachada, interior e comprovante de endereço) para concluir a auditoria.
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
- [ ] Upload Obrigatório: A auditoria não pode ser movida para o status COMPLETED sem que as imagens obrigatórias tenham sido enviadas.
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

# abre a interface visual do banco de dados no browser
npm run prisma:studio
```
