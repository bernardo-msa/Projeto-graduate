# Graduate — MVP de Acompanhamento Acadêmico / NEAP

Projeto inicial para a disciplina de Desenvolvimento de Software. **Esta é uma implementação nova, inspirada nos padrões documentados dos CInCoders**, não uma cópia literal dos repositórios oficiais. O ambiente em que os arquivos foram preparados permitiu consultar as páginas de documentação, mas não clonar/instalar os repositórios e as dependências originais. Antes de integrar ao repositório da disciplina, compare os arquivos com o boilerplate gerado pelo script oficial.

**Status:** código-fonte inicial entregue; dependências não instaladas e aplicação não executada/validada neste ambiente. Conforme solicitado, não foram escritos nem executados testes.

## O que já foi implementado

- Login via Keycloak (OIDC no frontend, verificação JWT no backend) e restrição de acesso por papel `NEAP`/`ADMIN`.
- Cadastro manual e busca/filtros de alunos, incluindo curso, matrícula, CR e créditos.
- Importação em lote de **CSV simples** para alunos (sem histórico) — não é sincronização SIGAA.
- Prontuário com histórico de tentativas, progresso em créditos e atendimentos feitos pelo NEAP.
- Resumo do painel, cursos e matrizes, disciplinas e contagens de tentativas/aprovações/reprovações.
- **Triagem EP exclusivamente indicativa** quando há duas ou mais reprovações na mesma disciplina obrigatória. Outros critérios não são inferidos a partir de dados parciais.
- Base PostgreSQL com Prisma, seed fictício e duas maneiras de inicializar os serviços.

## Pré-requisitos

Docker Desktop/Engine com `docker compose`, Node.js **24** e npm (o backend NestJS também roda no Node 24). Baixe tudo da raiz desta pasta.

## Modo A — iniciar somente a infraestrutura no Docker (mais didático)

No terminal 1, dentro de `graduate-mvp/`:

```bash
docker compose up -d
```

No terminal 2:

```bash
cd graduate-back
cp .env.example .env
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

No terminal 3, a partir da raiz do projeto:

```bash
cd graduate-front
cp .env.example .env
npm install
npm run dev
```

Acesse **http://localhost:5173**. Clique em **Entrar com Keycloak**. Credenciais locais de exemplo: `neap.demo` / `neap12345`. Não use essa senha nem esses dados em ambiente real.

Outros endereços: API em `http://localhost:3000/graduate/api/v1`, health check público em `/graduate/api/v1/health`, Swagger em `http://localhost:3000/api/docs` (requisições acadêmicas exigem Bearer token), console Keycloak em `http://localhost:8080` (`admin` / `admin_dev` só para desenvolvimento).

**Por que `db:push`?** É a forma mais simples de criar as tabelas no primeiro estudo, sem gerenciar migrations. Para um projeto compartilhado sério, façam migrations versionadas em vez de usar `db:push` repetidamente:

```bash
cd graduate-back
npm run migration:generate
# Nas máquinas da equipe, após commitar a pasta prisma/migrations:
npm run migration:run
```

Não misturem criação e aplicação de migrations sem coordenar com o grupo.

## Modo B — tudo com Docker Compose

Se preferir evitar instalar as dependências Node no computador:

```bash
docker compose --profile app up --build
```

Acesse `http://localhost:5173`. Este modo usa os Dockerfiles e popula a base com dados fictícios. Requer internet para baixar as imagens e dependências.

Para desligar:

```bash
docker compose --profile app down
```

**Não use `down -v` sem querer apagar os dados de desenvolvimento** (remove volumes).

## Estrutura de pastas

```text
graduate-mvp/
├── compose.yml                      # PostgreSQL, Keycloak e app opcional
├── infra/keycloak/graduate-realm.json
├── graduate-back/
│   ├── prisma/schema.prisma         # Tabelas e relações do banco
│   ├── prisma/seed.ts               # Alunos/disciplina fictícios
│   └── src/
│       ├── main.ts, app.module.ts
│       ├── auth/                     # Proteção por JWT e papéis
│       ├── common/                   # DTOs Zod e triagem
│       ├── database/                 # PrismaService
│       └── modules/                  # alunos, cursos, disciplinas, painel
├── graduate-front/
│   ├── src/app/                     # AuthProvider, rotas
│   ├── src/components/              # Interface compartilhada
│   ├── src/hooks/                   # useAsync
│   ├── src/services/                # fetch com token
│   ├── src/modules/                 # uma pasta para cada domínio
│   └── src/styles.css               # Identidade visual inspirada no protótipo
├── exemplo-importacao.csv
├── referencias/prototipo-original.html
└── docs/GUIA_COMPLETO.md            # Explicação didática, arquivo a arquivo
```

## O que não foi implementado

Integração real com SIGAA, cadastro automático de currículos e pré-requisitos, cálculo real do CR a partir de *todos* os históricos, médias e taxas institucionais completas, revisão/aprovação formal de EP, exportação/relatórios, logging e auditoria robusta, recuperação de falhas avançada, acessibilidade refinada, paginação de milhares de alunos, dashboards gráficos, CI/CD e testes automatizados. O MVP é para estudo em base fictícia, não para colocar dados reais de estudantes em produção.

## Observações importantes

O protótipo HTML original continha elementos ilustrativos (por exemplo, números como 342 estudantes, status de sincronização SIGAA e aprovação de EP) e até uma simulação de sincronização com `alert()`; **eles não significam que o sistema já dispõe dessas integrações**. A interface nova mostra contagens reais da base demonstrativa.

Os materiais enviados citam resoluções distintas para Estudos Planejados. É obrigatório conferir com o NEAP qual regulamento efetivamente se aplica antes de interpretar critérios automaticamente. Nenhuma regra foi considerada uma deliberação institucional.

Nunca publique o arquivo `.env` com segredos, nem utilize o CSV fictício como informação institucional. Consulte `docs/GUIA_COMPLETO.md` antes de alterar código.

## Documentações consultadas

- https://cincoders-nestjs-starterkit.vercel.app/docs/setup/quick-start
- https://cincoders-nestjs-starterkit.vercel.app/docs/architecture/overview
- https://cincoders-nestjs-starterkit.vercel.app/docs/guides/module-scaffolding
- https://cincoders-reactjs-starterkit.vercel.app/docs/setup/quick-start
- https://cincoders-reactjs-starterkit.vercel.app/docs/architecture/overview
- https://cincoders-reactjs-starterkit.vercel.app/docs/guides/module-scaffolding

> Nota: a landing page do NestJS menciona TypeORM, mas as instruções internas atualizadas de setup, módulos e migrations descrevem Prisma. Este projeto usa Prisma.
