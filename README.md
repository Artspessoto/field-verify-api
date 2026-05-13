# FieldVerify API

FieldVerify é uma aplicação desenvolvida para gerenciar fluxos de auditoria em campo e prevenção à fraude em processos de credenciamento B2B.

## RFs (Requisitos funcionais)

- [ ] Cadastro de Usuários: Deve ser possível cadastrar agentes e supervisores;
- [ ] Autenticação: Deve ser possível se autenticar via JWT;
- [ ] Perfil: Deve ser possível obter o perfil do usuário logado;
- [ ] Histórico: Deve ser possível obter o histórico de auditorias realizadas pelo agente;
- [ ] Busca por Proximidade: Deve ser possível buscar lojistas próximos (até 10km);
- [ ] Busca por Dados: Deve ser possível buscar lojistas por nome ou CNPJ;
- [ ] Check-in de Auditoria: Deve ser possível realizar o check-in ao chegar em um lojista;
- [ ] Validação: Deve ser possível validar a conclusão de uma auditoria;
- [ ] Gestão de Lojistas: Deve ser possível cadastrar novos lojistas para a fila de auditoria.

## RNs (Regras de Negócio)

- [ ] E-mail Único: O usuário não deve poder se cadastrar com um e-mail duplicado;
- [ ] Limite Diário: O agente não pode realizar duas auditorias no mesmo lojista no mesmo dia;
- [ ] Trava de Distância: O agente não pode iniciar a auditoria se não estiver a menos de 100m do estabelecimento;
- [ ] Trava de Tempo: A auditoria só pode ser validada em até 20 minutos após o início do check-in;
- [ ] Nível de Acesso: Lojistas e validações finais só podem ser geridos por administradores/supervisores.

## RNFs (Requisitos não-funcionais)

- [ ] Criptografia: As senhas devem ser persistidas utilizando BcryptJS;
- [ ] Persistência: Os dados devem ser armazenados em um banco PostgreSQL;
- [ ] Escalabilidade: Listagens devem ser paginadas (20 itens por página);
- [ ] Segurança: O usuário deve ser identificado por um JWT (JSON Web Token) com Refresh Token.
