# Guia de estudo completo — Graduate MVP

**Público-alvo:** equipe de Desenvolvimento de Software familiarizada com conceitos de programação em Python ou C++, mas iniciando em TypeScript, React, NestJS, Prisma e Keycloak.

**Como ler:** não é necessário compreender todos os 60 arquivos de uma vez. A ordem recomendada é: objetivo do produto → arquitetura → banco → API → interface → fluxo completo → exercícios de leitura. Os trechos citados correspondem aos arquivos reais entregues nesta pasta.

> Limite da entrega: o código não foi instalado, executado ou testado no ambiente de preparação (sem acesso aos repositórios npm e sem Docker disponível). O objetivo foi escrever uma implementação inicial legível. Portanto, **é possível que ajustes de instalação ou compatibilidade sejam necessários** quando a equipe executar os projetos. Nenhum teste foi criado, conforme solicitado.

---

## 1. Antes do código: o que o Graduate realmente resolve?

O problema trazido pelo NEAP não é simplesmente que falte um gráfico. As informações relevantes para entender a trajetória de um estudante estão fragmentadas: cadastro, histórico de disciplinas, notas, créditos, repetições de componentes curriculares, contatos e orientações. A equipe pedagógica precisa reuni-las antes de ter condições de agir.

O Graduate organiza essas informações em quatro perspectivas:

1. **Aluno:** prontuário, progresso em créditos, histórico por disciplina e registros de acompanhamento.
2. **Disciplina:** total de tentativas, aprovações e reprovações nos dados disponíveis.
3. **Curso e currículo:** matriz do curso, créditos exigidos e população cadastrada.
4. **Estudos Planejados:** indícios para triagem que o NEAP deve confirmar — nunca decisão automática de benefício ou desligamento.

O HTML inicial fornecido pelo grupo ajudou a definir o que deveria aparecer na tela: menu lateral, painel geral, alunos, disciplinas, cursos, Estudos Planejados e janela lateral de prontuário. Contudo, naquele protótipo, várias informações eram constantes escritas diretamente no HTML, e botões como “sincronizar SIGAA” apenas exibiam mensagens `alert()`. Isso é adequado em uma maquete de interface; **não constitui integração nem persistência**.

A passagem de protótipo a MVP é justamente retirar valores fixos da interface e fazer com que dados e ações sejam processados por uma API conectada ao banco. Esse é o núcleo do nosso trabalho.

### O que consideramos essencial (MVP)

- Identificação de cursos e disciplinas e sua relação com estudantes.
- Cadastro e consulta de estudantes.
- Histórico de tentativas acadêmicas, inclusive repetição de disciplina.
- Visualização de progresso com créditos concluídos e totais.
- Registro de ações do NEAP para permitir acompanhamento.
- Triagem responsável de um critério verificável de Estudos Planejados.
- Autenticação e proteção de acesso com Keycloak.

A integração institucional com o SIGAA, automatização completa dos indicadores, classificação avançada e relatórios sofisticados ficam para versões seguintes, pois dependem de acesso institucional, definição oficial de regras e dados completos.

---

## 2. As tecnologias: mapa mental para quem sabe Python e C++

| Tecnologia | O que é | Analogia simples |
|---|---|---|
| **Node.js** | Ambiente que executa JavaScript fora do navegador | Interpretador Python executando um servidor, mas para JavaScript/TypeScript transpilado |
| **TypeScript** | JavaScript com verificação de tipos durante desenvolvimento | Python com anotações estáticas mais fortes, ou C++ com sintaxe JS |
| **NestJS** | Framework para escrever o servidor/API | FastAPI ou Django REST Framework, com módulos e injeção de dependências |
| **React** | Biblioteca de construção de interface no navegador | Funções que descrevem a aparência da tela a partir de dados e estado |
| **Vite** | Ambiente de desenvolvimento/build do front-end | Ferramenta de compilação e recarregamento automático, parecida em função a um build system |
| **PostgreSQL** | Banco de dados relacional | Tabelas e chaves estrangeiras de um SGBD SQL |
| **Prisma** | Camada que traduz operações TypeScript em consultas ao banco | ORM equivalente a SQLAlchemy no Python |
| **Keycloak** | Servidor de login e autorização | Serviço externo que confere a identidade e fornece tokens assinados |
| **Docker Compose** | Inicialização conjunta dos serviços | Descrever processos e dependências de execução em um arquivo YAML |
| **Zod** | Validação de estruturas de dados recebidas | Validação de schemas em Pydantic, com regras executadas em runtime |

Não há necessidade de aprender *toda* a linguagem JavaScript antes de ler o projeto. Entender funções, objetos, arrays, `async/await`, módulos e algumas construções de React já permite seguir os fluxos principais.

### 2.1 JavaScript e TypeScript não são a mesma coisa

TypeScript adiciona informações de tipo que o compilador usa para encontrar erros. Exemplo:

```ts
let creditos: number = 68;
let nome: string = 'Mariana';

interface AlunoSimples {
  nome: string;
  creditos: number;
}

const aluno: AlunoSimples = { nome, creditos };
```

`interface AlunoSimples` descreve o formato esperado de um objeto. A interface **não vira uma classe real em execução**; serve principalmente ao editor e ao compilador. Em Python, podemos imaginar um `TypedDict` ou `dataclass` (embora a semântica não seja igual). Em C++, se aproxima da ideia de declarar um `struct`, mas objetos JavaScript são dinâmicos.

`const` impede reatribuir a variável; não impede necessariamente alterar os atributos de um objeto. `let` permite reatribuição. Preferimos `const` por padrão.

### 2.2 Objetos JavaScript

Um objeto:

```ts
const aluno = {
  nome: 'Mariana',
  cr: 6.4,
  matricula: 'DEMO0001',
};
```

Lembra um dicionário Python (`{'nome': 'Mariana', 'cr': 6.4}`) com acesso usando `aluno.nome`. As chaves podem representar registros, argumentos e resultados da API.

### 2.3 Arrow functions: `=>`

```ts
const dobro = (x: number) => x * 2;
const nomes = alunos.map((aluno) => aluno.nome);
```

`=>` é a sintaxe mais usada para declarar funções curtas. A operação `.map()` aplica uma transformação para cada elemento de uma lista e produz outra lista (parecido com `[aluno.nome for aluno in alunos]` em Python).

Outros métodos que aparecem no projeto:

```ts
alunos.filter((a) => a.cr < 5);  // conserva elementos que atendem à condição
alunos.find((a) => a.id === id);  // devolve o primeiro encontrado
alunos.some((a) => a.cr < 5);     // verifica se algum atende à condição
```

`===` compara sem conversão automática de tipos, sendo preferível a `==` em JavaScript.

### 2.4 Operadores importantes

```ts
const nome = aluno.nome ?? 'Não informado';
const email = aluno?.email;
const novo = { ...aluno, cr: 7.0 };
```

`??` fornece um valor alternativo se o primeiro for `null` ou `undefined`. `?.` tenta acessar uma propriedade apenas se o objeto existir. `{ ...aluno }` faz uma **cópia superficial** das propriedades de um objeto (não uma cópia profunda das estruturas aninhadas).

`!` em `document.getElementById('root')!` é uma afirmação de que aquela referência não será nula. No projeto, há um elemento `<div id="root">` no HTML, por isso a afirmação é apropriada naquele ponto.

### 2.5 `async` e `await`

Consultar uma API ou banco costuma demorar alguns milissegundos. Não queremos interromper a execução enquanto esperamos, então as funções trabalham com Promises:

```ts
async function carregarAlunos() {
  const resposta = await fetch('/api/alunos');
  return resposta.json();
}
```

Uma função `async` devolve uma `Promise`, mesmo quando parece devolver diretamente um valor. `await` espera o resultado daquela operação sem bloquear toda a aplicação Node. Em Python, o mecanismo equivalente é `async def` / `await`; em C++, pense em uma abstração de operação assíncrona, não necessariamente no modelo de `std::future`.

### 2.6 Importação de arquivos

```ts
import { AlunosService } from './alunos.service';
export class AlunosController { /* ... */ }
```

`export` torna uma declaração disponível para outro arquivo. `import` utiliza essa declaração; lembra `import modulo` em Python, embora o modelo de módulos seja diferente. O caminho `./` significa a pasta atual e `../` a pasta acima.

---

## 3. Arquitetura do Graduate: quem conversa com quem?

```text
[NAVEGADOR]
  React + TypeScript + Vite
       │
       │ (1) redireciona ao login
       ▼
  Keycloak (usuário / senha / token JWT)
       │
       │ (2) navegador recebe token
       ▼
[NAVEGADOR] -- GET /alunos + Bearer JWT --> [NestJS API]
                                              │
                                              │ (3) valida token com Keycloak
                                              │ (4) aplica regra de negócio
                                              ▼
                                         [Prisma ORM]
                                              │
                                              ▼
                                         [PostgreSQL]
                                              │
                                              ▼
                            [Resposta JSON] ---> [React renderiza a lista]
```

São **três processos principais** (front-end, API, identidade) mais o banco. O backend concentra a lógica: o front-end não se conecta diretamente ao PostgreSQL. O React não deve decidir por conta própria que uma pessoa é elegível a EP. O banco armazena dados; não conhece a interface gráfica.

No curso foi solicitada uma arquitetura organizada em microserviços. Para o MVP, implementamos um **serviço de negócio Graduate** com módulos internos bem separados. Tecnicamente, um único NestJS com módulos é um *monólito modular*: não vamos chamar cada pasta de “microserviço”. Ele pode integrar um ecossistema de microserviços com Keycloak e outros serviços no futuro. Isso reduz complexidade enquanto a equipe aprende o domínio.

### 3.1 Por que front-end e back-end em pastas separadas?

Porque o navegador e o servidor executam códigos com responsabilidades diferentes. Em uma equipe, uma pessoa pode estudar o componente visual enquanto outra desenvolve uma rota, desde que concordem sobre o formato dos dados trocados via API.

`graduate-front` e `graduate-back` têm seus próprios `package.json` e dependências. O arquivo `compose.yml`, na pasta superior, orquestra infraestrutura ou tudo opcionalmente.

---

## 4. A modelagem do banco: `prisma/schema.prisma`

Este é um dos arquivos mais importantes do projeto. Se ele estiver errado, os relatórios e critérios acadêmicos ficarão errados.

### 4.1 Entidade `Curso`

```prisma
model Curso {
  id                 String  @id @default(uuid()) @db.Uuid
  codigo             String  @unique
  nome               String
  matriz             String
  creditosTotais     Int
  semestresPrevistos Int
  alunos             Aluno[]
  disciplinas        Disciplina[]
}
```

`model Curso` corresponde, na prática, a uma tabela no PostgreSQL. `id` é a chave primária, gerada como UUID; `codigo` não pode se repetir. `Aluno[]` indica que o curso está ligado a vários alunos. Uma única linha da tabela `Curso` pode representar “Ciência da Computação, Matriz 2023, 160 créditos”.

### 4.2 Entidade `Disciplina`

Cada disciplina possui código, nome, créditos e uma referência `cursoId` para o curso a que pertence. `@@unique([cursoId, codigo])` impede repetir o mesmo código dentro do mesmo curso, mas permite que um código exista em cursos diferentes.

O campo `obrigatoria` foi introduzido para distinguir componentes obrigatórios, dado relevante para a análise preliminar de EP. Ainda não existe uma estrutura de pré-requisitos entre disciplinas. Também não existem turmas reais separadas de disciplinas; esta é uma simplificação consciente.

### 4.3 Entidade `Aluno`

Armazena `matricula`, `nome`, `email`, `periodoIngresso`, `modalidadeIngresso`, `cr`, `creditosConcluidos` e o `cursoId`. O identificador (`id`) é interno. A matrícula continua única e pode aparecer nas buscas. Essa distinção evita tratar a matrícula como chave de relacionamento em todas as tabelas.

O CR atual é um **valor informado**, não calculado automaticamente. Para calculá-lo de modo correto a partir do histórico real, seria preciso saber exatamente como a instituição o pondera, quais componentes entram no cálculo e dispor de todas as notas necessárias. Isso não está garantido pelos dados do MVP.

O percentual de créditos concluídos, por outro lado, é simples:

```text
percentual = 100 * créditosConcluídos / créditosTotaisDoCurso
```

Por exemplo, com 68 de 160 créditos, o progresso é 42,5%. O backend arredonda a uma casa decimal. Esse cálculo mostra integralização por **créditos**, não um julgamento geral de rendimento ou prazo.

### 4.4 Entidade `Tentativa`

Este é o ponto mais importante para detectar repetências.

Considere:

| Aluno | Disciplina | Semestre | Nota | Situação |
|---|---|---|---|---|
| Mariana | MAT001 — Cálculo I | 2023.1 | 4,2 | Reprovado por nota |
| Mariana | MAT001 — Cálculo I | 2023.2 | 5,4 | Reprovado por nota |
| Mariana | DCC001 — Algoritmos | 2023.1 | 8,5 | Aprovado |

Não basta armazenar que “Mariana cursou Cálculo I”. Precisamos representar **cada vez que ela cursou** o componente. Por isso a tabela `Tentativa` relaciona um aluno a uma disciplina e a um período, preservando nota, frequência e situação.

`@@unique([alunoId, disciplinaId, periodo])` evita a mesma combinação repetida. Não impede que uma disciplina seja cursada em 2023.1 e novamente em 2023.2. Sem essa tabela, a regra de duas reprovações seria impossível de aplicar corretamente.

### 4.5 Entidade `Atendimento`

Guarda tipo, descrição, autor do registro e data. Ela atende à necessidade de registrar o acompanhamento feito pelo NEAP, como contato com estudante ou encaminhamento. Por exemplo: “orientação pedagógica realizada em data X”.

Não criamos campos livres para diagnósticos sensíveis. Mesmo assim, textos de atendimentos podem conter dados pessoais ou sensíveis. Em uma versão institucional de produção, esse módulo exige política de acesso, retenção, minimização, auditabilidade e autorização da instituição.

### 4.6 Relações no banco

```text
Curso (1) ----------- (N) Aluno
  │                       │
  │                       ├-------- (N) Tentativa (N) ------- (1) Disciplina
  │                       │
  │                       └-------- (N) Atendimento
  └----------------------------- (N) Disciplina
```

O `(1)` e `(N)` significam “um” e “muitos”. Uma `Tentativa` pertence a exatamente um `Aluno` e a uma `Disciplina`; um aluno pode ter várias tentativas. Essa forma evita repetir o nome da disciplina em cada histórico.

### 4.7 Prisma no TypeScript

```ts
const alunos = await this.prisma.aluno.findMany({
  include: { curso: true },
  orderBy: { nome: 'asc' },
});
```

Equivale conceitualmente a um `SELECT` com junção a `Curso` e ordenação pelo nome. `.findMany()` é uma operação de consulta, `.create()` insere, `.findUnique()` procura pela chave e `.upsert()` insere ou atualiza conforme a existência de registro. O Prisma constrói consultas SQL parametrizadas e gera tipos correspondentes ao schema.

O arquivo `src/database/prisma.service.ts` encapsula a conexão. `PrismaModule` o fornece a todos os módulos usando `@Global()`.

### 4.8 `prisma/seed.ts`

“Seed” significa popular o banco com registros de exemplo. Este arquivo cria dois cursos, seis disciplinas e cinco alunos **inteiramente fictícios**. Algumas tentativas geram indícios de EP para permitir observar a interface.

O seed é *idempotente* em sua finalidade básica: usa `upsert` com identificadores únicos, de forma que executá-lo novamente não duplica as entidades principais. Não é uma importação de dados reais.

---

## 5. Como funciona o back-end NestJS

### 5.1 Arquivo `src/main.ts`: inicializar a API

O NestJS começa executando:

```ts
const app = await NestFactory.create(AppModule);
app.setGlobalPrefix('graduate/api/v1');
app.enableCors({ origin: process.env.FRONTEND_ORIGIN });
await app.listen(3000);
```

`NestFactory.create(AppModule)` cria a aplicação usando as configurações de `AppModule`. `setGlobalPrefix` faz as rotas começarem com `/graduate/api/v1`. A rota `@Controller('alunos')` com `@Get()` torna-se `GET http://localhost:3000/graduate/api/v1/alunos`.

CORS é uma política do navegador. Como React roda em `localhost:5173` e API em `localhost:3000`, a API precisa permitir esse endereço. CORS **não substitui autenticação**, apenas determina quais origens podem ler respostas no navegador.

`SwaggerModule.setup('api/docs', ...)` publica uma tela de documentação dos endpoints. Ela é útil para conhecer as rotas, mas as operações de dados continuam exigindo autenticação.

### 5.2 Arquivo `src/app.module.ts`: a composição

```ts
@Module({
  imports: [PrismaModule, AlunosModule, CursosModule, DisciplinasModule, PainelModule],
})
export class AppModule {}
```

É o módulo que agrega os outros. O arquivo real também carrega variáveis `.env`, valida configuração e instala dois comportamentos globais: `KeycloakGuard` (autorização) e `ZodValidationPipe` (validação dos dados).

O símbolo `@Module` é um **decorator**, uma anotação que o Nest interpreta. Em Python há decorators; em C++ o paralelo é mais distante — imagine metadados que o framework lê para montar e relacionar objetos.

### 5.3 Três arquivos por domínio: module, controller, service

Pense no domínio “Alunos”:

- `alunos.module.ts`: declara quais classes compõem a funcionalidade.
- `alunos.controller.ts`: determina URLs HTTP, argumentos de entrada e métodos chamados.
- `alunos.service.ts`: executa consultas, valida relacionamentos e aplica regras de negócio.

Essa separação evita inserir SQL, validação e decisões pedagógicas diretamente no manipulador da URL.

### 5.4 `alunos.controller.ts`: o que é uma rota?

Exemplo real:

```ts
@Get(':id')
buscar(@Param('id', ParseUUIDPipe) id: string) {
  return this.alunos.buscar(id);
}
```

`@Get(':id')` significa responder a uma requisição HTTP GET com o identificador na URL. `@Param('id')` extrai o trecho da URL, como `/alunos/f3d...`. `ParseUUIDPipe` rejeita IDs que não são UUIDs. Depois, `this.alunos.buscar(id)` delega o trabalho ao service.

Compare com Python/FastAPI:

```python
@app.get('/alunos/{id}')
def buscar_aluno(id: str):
    return servico.buscar(id)
```

O código não é idêntico, mas as responsabilidades são parecidas.

### 5.5 `alunos.service.ts`: injeção de dependência

```ts
@Injectable()
export class AlunosService {
  constructor(private readonly prisma: PrismaService) {}
}
```

O `constructor` recebe um objeto Prisma. Não escrevemos `new PrismaService()` dentro do service: o Nest constrói e entrega a dependência. Esse padrão é chamado **injeção de dependências** e facilita evoluir componentes mantendo suas responsabilidades separadas.

`private readonly` indica que o campo pertence à instância e não deverá ser reatribuído pela classe. É semelhante a construir uma classe em C++ recebendo por construtor uma referência a um objeto de armazenamento de dados.

### 5.6 Cadastro de um aluno: validação no servidor

`POST /alunos` recebe JSON com matrícula, nome, curso, período, CR e créditos. O controlador recebe `CreateAlunoDto`; a validação é declarada em `src/common/validation.ts`, por exemplo:

```ts
export const CreateAlunoSchema = z.object({
  nome: z.string().trim().min(3).max(150),
  cr: z.number().min(0).max(10).default(0),
  cursoId: z.uuid(),
});
```

O trecho acima é um recorte do schema completo. Ele especifica que nome deve ser texto com tamanho apropriado, CR entre 0 e 10 e cursoId no formato UUID. O Nest usa o Zod para rejeitar requisições inválidas. A interface também restringe campos, mas **a verificação do backend é indispensável**, pois alguém pode enviar chamadas HTTP sem passar pelo React.

No service, ainda conferimos se o curso existe e se os créditos concluídos não ultrapassam os exigidos. Estas são **regras entre dados**, não simples verificações de formato.

### 5.7 Por que pode haver erro HTTP 409?

Uma matrícula é única. Se alguém tentar cadastrar novamente a mesma matrícula, o PostgreSQL/Prisma pode gerar o erro `P2002`. O service converte esse erro em `ConflictException`, que o Nest responde como HTTP 409. Isso é mais informativo do que deixar o aplicativo encerrar inesperadamente.

Outros status úteis: `200` (consulta concluída), `201` (criado), `400` (dados inválidos), `401` (token não aceito), `403` (sem permissão), `404` (registro inexistente), `409` (conflito entre dados).

### 5.8 Por que importação em lote usa transação?

O arquivo `alunos.service.ts` tem um método `importar(dtos)`. O lote pode conter 30 alunos. Se o 27º for uma matrícula já existente, não seria desejável deixar apenas os 26 primeiros salvos sem avisar. A função usa `this.prisma.$transaction(...)`:

```ts
await this.prisma.$transaction(
  alunos.map((dados) => this.prisma.aluno.create({ data: dados }))
);
```

O exemplo acima ilustra a ideia de atomicidade; o código real mapeia os campos permitidos. **Ou todos são persistidos, ou nenhum**, se houver conflito durante a transação. A versão do MVP não atualiza matrículas existentes — rejeita a importação inteira, para evitar sobrescrever registros por engano.

Importante: um arquivo CSV de aluno NÃO inclui as tentativas/histórico. Importar os dados cadastrais não altera as estatísticas de reprovação até que o histórico seja cadastrado.

### 5.9 `cursos.controller.ts`

Consulta cursos e usa `_count` do Prisma para contar alunos e disciplinas por curso. É uma rota de **leitura**. O MVP não permite cadastrar novos cursos pela interface; as matrizes demonstrativas são criadas pelo seed. Isso simplifica o escopo inicial.

### 5.10 `disciplinas.controller.ts`

Lista disciplinas e suas tentativas. O cálculo:

```ts
const reprovadas = tentativas.filter(
  (t) => t.situacao.startsWith('REPROVADO')
).length;
```

Conta **ocorrências de reprovação registradas**, não alunos distintos reprovados, nem uma taxa institucional completa. Se um estudante reprovar duas vezes, são duas tentativas. Isso é proposital, pois a unidade de análise aqui é a tentativa por disciplina.

### 5.11 `painel.controller.ts`

Lê todos os alunos e calcula total, CR médio do cadastro, quantos estão em atenção e quantos possuem um indício de EP. No protótipo HTML os totais eram constantes. Aqui as contagens vêm dos registros reais da base disponível. Quando você cadastra outro aluno e atualiza a página, o total muda.

Para uma instituição com milhares de alunos, essas agregações deverão migrar para consultas otimizadas/paginadas no banco. Em um MVP com meia dúzia de registros demonstrativos, o código direto ajuda a compreensão.

### 5.12 `src/common/triagem.ts`: as regras de acompanhamento

Há um design importante: **os critérios não estão espalhados por todas as telas**. Estão concentrados numa função de negócio:

```ts
export function triagem(aluno: AlunoCompleto) {
  // ... extrai tentativas reprovadas ...
  // ... conta reprovações por disciplina obrigatória ...
  // ... devolve situacao e evidencias ...
}
```

No código real, uma `Map<string, number>` conta reprovações por `disciplinaId`. É o equivalente a um `dict` Python com contagem. Se uma disciplina obrigatória tem duas ou mais reprovações, o sistema marca `POSSIVEL_EP`. O estado `ATENCAO` é reservado ao caso com alguma reprovação no recorte, mas sem aquela repetência. `REGULAR` significa apenas que **não apareceram reprovações nos registros cadastrados**, não uma certificação de normalidade acadêmica.

O modelo das evidências contém quatro campos:

```ts
evidencias: {
  duasReprovacoesMesmaDisciplina: true | false,
  todasReprovadasUltimoSemestre: null,
  crBaixoDoisSemestres: null,
  prazoIntegralizacao: null,
}
```

O `null` comunica **não avaliado**, que é diferente de `false` (**avaliado e não identificado**). Seria metodologicamente errado dizer que um aluno não se enquadra nos demais critérios quando não temos o histórico integral necessário para avaliá-los.

Essa é uma decisão que protege a qualidade pedagógica do projeto. Na versão atual, o sistema não declara “elegível” como ato administrativo. O rótulo é explicitamente **possível EP, sujeito à conferência pelo NEAP**.

O conjunto de imagens fornecido menciona, ao menos, “duas reprovações na mesma disciplina”, “reprovação em todas no último semestre”, “CR baixo em dois semestres consecutivos” e “prazo de integralização”. Também há citações normativas diferentes no material. **Não se deve tratar o texto do HTML ilustrativo como fonte definitiva do regulamento**: confirmem a resolução atual aplicável com o NEAP e transformem-na num conjunto de requisitos assinados antes de automatizar outros critérios.

### 5.13 `src/auth/keycloak.guard.ts`: o caminho da segurança

Qualquer pessoa pode inspecionar e modificar o JavaScript que roda no próprio navegador. Portanto, esconder um botão no React **não protege os dados**. O servidor precisa conferir a identidade e as permissões em cada requisição.

O guard faz, em linhas gerais:

1. Pega o cabeçalho `Authorization: Bearer <token>`.
2. Consulta as chaves públicas JWKS do Keycloak para verificar a **assinatura criptográfica** do JWT.
3. Confere emissor (`issuer`), audiência (`audience`) e expiração.
4. Confere as roles de realm (`NEAP` ou `ADMIN`).
5. Se tudo estiver correto, permite continuar; caso contrário, devolve 401 ou 403.

O guard é instalado globalmente em `AppModule`. Não precisamos lembrar de proteger cada rota. A exceção deliberada é o endpoint de health check, marcado com `@Public()`.

O nome de usuário que assina um atendimento vem do token validado. Isso evita o usuário simplesmente preencher “fulano” no formulário e atribuir o atendimento a outra pessoa.

Esta segurança é adequada como **protótipo didático**, mas não constitui certificação de segurança de dados pessoais. Produção requer HTTPS, política de roles com privilégios mínimos, auditoria, backups, proteção de logs e análise institucional de conformidade com a LGPD.

### 5.14 `src/auth/roles.decorator.ts` e `public.decorator.ts`

Esses arquivos definem metadados reutilizáveis para declarar permissões ou acesso público. O `@Roles(...)` já está preparado para evolução, embora o MVP use, de forma simples, papéis `NEAP`/`ADMIN` para todas as operações acadêmicas. O `@Public()` é usado no health check.

### 5.15 Migrations e `db:push`

O schema Prisma representa a estrutura desejada do banco. Para aplicar pela primeira vez:

```bash
npm run prisma:generate  # gera o cliente TypeScript
npm run db:push          # cria/adapta tabelas para desenvolvimento
npm run db:seed          # carrega registros fictícios
```

O `db:push` é conveniente para começar, mas, quando vários membros do grupo alterarem o banco, usem migrations com scripts SQL versionados. Isso permite registrar o histórico de alterações no esquema.

---

## 6. Como funciona o front-end React

### 6.1 `index.html` e `src/main.tsx`

`index.html` contém uma div vazia:

```html
<div id="root"></div>
```

`main.tsx` encontra essa div e pede ao React para desenhar o aplicativo ali. O React constrói e atualiza a árvore de componentes. O `.tsx` significa TypeScript com JSX (sintaxe parecida com HTML dentro de funções JavaScript).

### 6.2 Um componente React é uma função

Exemplo:

```tsx
function Saudacao() {
  return <h1>Bem-vindo ao Graduate!</h1>;
}
```

A função não devolve literalmente um texto HTML cru. O JSX é transformado durante o build em chamadas JavaScript que o React interpreta para atualizar a interface.

Uma página também é um componente, por exemplo `AlunosPage()`. Componentes podem ser combinados dentro de outros componentes.

### 6.3 `app/provider.tsx`: sessão de login

O `AuthProvider` da biblioteca `react-oidc-context` fornece informações de sessão para os componentes filhos. Ele sabe o endereço do Keycloak, o client do front-end, para onde voltar após login e quais informações solicitar.

Usamos o fluxo `authorization code` com PKCE configurado no Keycloak, adequado a aplicações executadas no navegador. A senha nunca passa pelo servidor Graduate. O navegador conversa com a página de login do Keycloak.

### 6.4 `app/App.tsx`: autenticação e rotas

O App controla três grandes estados: enquanto verifica a sessão, mostra carregamento; sem login, exibe “Entrar com Keycloak”; com login e papel apropriado, abre a navegação. As rotas são criadas com `react-router-dom`:

```tsx
<Route path="/alunos" element={<AlunosPage />} />
<Route path="/disciplinas" element={<DisciplinasPage />} />
```

Quando você navega para `/alunos`, o React mostra a página de alunos, sem precisar carregar um documento HTML novo inteiro. O `react-router-dom` gerencia o endereço no navegador.

Para a experiência de usuário, o App lê as roles do access token e esconde as páginas se não tiver papel. Essa leitura **não confere autenticidade criptográfica**; a verificação de segurança pertence ao back-end.

### 6.5 `components/Layout.tsx`: estrutura visual

Responsável pelo menu lateral, cabeçalho, identificação de usuário e contêiner central. O `<Outlet />` é a região onde cada página da rota atual aparece.

Os links `NavLink` recebem automaticamente indicação de rota ativa. Assim, o menu “Alunos” fica destacado quando o usuário está naquela página.

Essa estrutura adapta a organização visual do HTML original sem copiar seus 1.051 linhas como um único componente React.

### 6.6 `styles.css`: a aparência

É CSS padrão com estilos de layout, tabelas, cartões, botões, formulários e barras de progresso. No protótipo original, a maior parte das classes vinha de Tailwind por CDN. Neste MVP, mantivemos um CSS próprio e curto: facilita aprender o que cada regra faz, sem introduzir outro framework de UI logo de início.

Termos frequentes:

```css
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
.button-row { display: flex; gap: 9px; }
```

`display: grid` constrói uma grade de colunas. `flex` organiza componentes em linhas/colunas com distribuição adaptável. As regras `@media` no fim do arquivo ajustam a interface para telas menores.

O objetivo é reproduzir a identidade geral do protótipo, não alcançar acabamento final de design.

### 6.7 `hooks/useAsync.ts`: carregar dados de maneira reutilizável

Uma página precisa descobrir quando os dados chegam ou falham. Quase todas teriam a mesma sequência: carregar → aguardar → sucesso/erro. Criamos um hook:

```ts
const { data, loading, error, reload } = useAsync(
  () => cursosService.listar(api),
  [api],
);
```

Um **hook** é uma função React cujo nome começa com `use`, que pode controlar estado e ciclo de vida de um componente. `useAsync` mantém quatro informações:

- `data`: resultado (ou `null` antes da primeira resposta).
- `loading`: se está esperando a operação.
- `error`: texto de erro, se ocorreu.
- `reload`: função para repetir a consulta.

`useState(...)` funciona como uma variável que, quando atualizada por seu setter, faz React renderizar o componente novamente. Já `useEffect(...)` executa lógica associada ao ciclo de vida: aqui, dispara uma consulta quando as dependências relevantes mudam.

O `useRef` no hook guarda um contador usado para não deixar uma resposta antiga substituir uma consulta mais recente: por exemplo, se o usuário muda rapidamente de curso duas vezes, queremos exibir o resultado da última escolha, e não da primeira requisição que demorou.

Essa é uma simplificação didática em relação a soluções de cache mais avançadas; satisfaz o escopo inicial.

### 6.8 `services/api.ts`: ponto único de contato com NestJS

O front-end não escreve `fetch()` em cada botão. Uma função compartilhada recebe o caminho da API e as opções de requisição:

```ts
const resposta = await api<Aluno[]>('/alunos');
```

A função `useApi` obtém o token atual do `AuthProvider`, tenta renová-lo quando estiver expirado e anexa o cabeçalho HTTP de autenticação:

```http
Authorization: Bearer eyJ...
```

Depois ela converte o JSON da resposta em dados TypeScript. Se o servidor retorna erro, cria uma mensagem legível para a página. Assim, todos os módulos usam o mesmo mecanismo de comunicação.

`ApiRequest` é um **tipo de função**. Em C++ o equivalente conceitual seria definir uma assinatura para uma função/callback; em Python pense em um `Callable` tipado.

### 6.9 `alunos.types.ts`: contratos entre o front-end e a API

Aqui estão `interface Aluno`, `interface Curso`, `interface Tentativa`, `interface Atendimento` e outras. Por exemplo:

```ts
interface Triagem {
  situacao: 'REGULAR' | 'ATENCAO' | 'POSSIVEL_EP';
  percentualConcluido: number;
}
```

Uma união de strings, como `'REGULAR' | 'ATENCAO'`, restringe os valores possíveis. Isso evita erros de digitação e permite ao editor sugerir opções.

Essas interfaces precisam continuar coerentes com os dados JSON produzidos pela API. Elas não transformam automaticamente respostas inválidas: são verificações de código em tempo de desenvolvimento.

### 6.10 `alunos.service.ts` e `useAlunos.ts`

Dois arquivos com papéis diferentes:

- `alunos.service.ts`: **o que chamar** na API (listar, buscar por ID, cadastrar, importar, registrar tentativa, registrar atendimento).
- `useAlunos.ts`: **como disponibilizar** esses dados para os componentes, reaproveitando `useAsync`.

Essa é uma adaptação direta do padrão “service → hook → page” ensinado pelos CInCoders. O front-end permanece simples e a lógica de rede fica fora dos elementos de interface.

### 6.11 `AlunosPage.tsx`: filtros + tabela

Esse componente guarda estados de interface:

```tsx
const [busca, setBusca] = useState('');
const [cursoId, setCursoId] = useState('');
```

O par `[busca, setBusca]` lembra declarar uma variável e uma função para atualizá-la, porém com um comportamento extra: `setBusca(...)` solicita nova renderização do componente.

Os campos `<input>` são **controlados** pelo estado:

```tsx
<input value={busca} onChange={(e) => setBusca(e.target.value)} />
```

Ao digitar, `onChange` atualiza `busca`. Como o hook de alunos depende da busca, ele chama a API com novo parâmetro. Os resultados chegam, e a tabela re-renderiza.

Para renderizar linhas:

```tsx
{alunos.map((aluno) => <tr key={aluno.id}>...</tr>)}
```

`key` identifica cada linha para que React atualize corretamente os elementos. A matrícula ou UUID poderia servir de chave estável; escolhemos o `id` interno.

**Busca e filtro são aplicados pelo backend.** Para o tamanho deste MVP, isso é mais simples que implementar paginação e cache sofisticados.

### 6.12 `AlunoForm.tsx`: formulário controlado

Os dados do formulário ficam num único objeto `form`, atualizado com `setForm`. Exemplo:

```ts
function set<K extends keyof NovoAluno>(campo: K, valor: NovoAluno[K]) {
  setForm((atual) => ({ ...atual, [campo]: valor }));
}
```

A sintaxe parece complexa, mas a ideia é direta: `K` representa uma chave válida de `NovoAluno`. `NovoAluno[K]` obriga que o tipo do valor corresponda à propriedade. Se `cr` é número, TypeScript não deveria aceitar uma string sem conversão.

No envio, `event.preventDefault()` impede o comportamento padrão de recarregar a página ao submeter HTML. Em seguida `await alunosService.criar(api, form)` chama o back-end e fecha o modal se o cadastro for bem-sucedido.

### 6.13 `ImportarCsv.tsx`: entrada em lote

A importação neste MVP usa um arquivo `;`-separado (ponto e vírgula). Primeiro interpreta o cabeçalho e as linhas, resolve o código do curso para o UUID, converte números e envia um array de alunos. O backend valida novamente e usa transação para inserir tudo.

O arquivo `exemplo-importacao.csv` traz duas linhas que você pode importar para observar a atualização da tabela. É essencial distinguir **CSV local** de **integração SIGAA**: neste MVP a importação é manual, o parser é simples, não suporta aspas com ponto e vírgula nem histórico, e o sistema não tem autorização nem endpoint de SIGAA.

Em uma versão posterior, um módulo de importação institucional poderia receber arquivos padronizados ou dados por API, fazer reconciliação por matrícula e registrar origem, data e alterações.

### 6.14 `AlunoDetalhe.tsx`: prontuário e abas

A janela lateral (*drawer*) mostra o estudante escolhido. O componente recebe três **props** (parâmetros de componentes React): `id`, `onClose` e `onChanged`.

- `id` indica qual aluno carregar.
- `onClose` é a função que fecha o drawer.
- `onChanged` avisa à página principal quando houve atualização de histórico, para atualizar as situações na tabela.

Há quatro abas: visão geral, histórico, EP e atendimentos. Cada uma exibe parte do mesmo objeto `aluno` recebido de `GET /alunos/:id`.

Na aba Histórico, o formulário chama `POST /alunos/:id/tentativas`; na aba Atendimentos, `POST /alunos/:id/atendimentos`. No sucesso, recarrega os dados daquele aluno com `reload()`.

Observação essencial: salvar uma nova tentativa **não recalcula automaticamente o CR geral nem os créditos concluídos**. Isso deve ser implementado somente após a equipe aprovar as regras de cálculo e disponibilidade dos históricos. As estatísticas de tentativas e a triagem por reprovações, no entanto, já reagem ao novo registro.

### 6.15 `Status.tsx` e `Feedback.tsx`

São exemplos de componentes simples reutilizáveis. `Status` recebe `REGULAR`, `ATENCAO` ou `POSSIVEL_EP` e escolhe a aparência visual. `Feedback` padroniza as mensagens de carregamento e falha. Se um texto de botão mudar, não é necessário alterar cinco páginas.

### 6.16 `CursosPage.tsx`, `DisciplinasPage.tsx`, `PainelPage.tsx`, `EpPage.tsx`

Essas páginas ficam propositalmente pequenas. Elas carregam dados usando `useAsync`/`useAlunos` e apresentam os resultados:

- `CursosPage`: os valores do banco para cada matriz/código, incluindo contagens.
- `DisciplinasPage`: aprovação/reprovação **por tentativa**.
- `PainelPage`: totais e indicadores dos alunos cadastrados.
- `EpPage`: relação de alunos com indício de dupla reprovação obrigatória, acompanhada de alerta sobre os critérios ainda não avaliados.

Tudo se apoia na mesma API. Não há outro cálculo de EP duplicado no front-end.

---

## 7. Exemplo completo: de um clique a uma linha no PostgreSQL

Suponha que você abra a página de alunos e clique em **Cadastrar aluno**.

**Passo A — React:** `AlunosPage` muda seu estado `modal` de `null` para `'novo'`. Como resultado, o componente `AlunoForm` aparece na tela.

**Passo B — formulário:** você digita nome, matrícula, período de ingresso, curso, CR e créditos. O React guarda esses valores no estado `form`.

**Passo C — POST:** quando clica em Cadastrar, o formulário chama:

```ts
await alunosService.criar(api, form);
```

O service faz, aproximadamente:

```http
POST http://localhost:3000/graduate/api/v1/alunos
Authorization: Bearer <token>
Content-Type: application/json

{
  "matricula": "DEMO7777",
  "nome": "Aluno Exemplo",
  "cursoId": "UUID-DE-UM-CURSO-EXISTENTE",
  "periodoIngresso": "2026.2",
  "modalidadeIngresso": "Não informada",
  "cr": 7.0,
  "creditosConcluidos": 12
}
```

**Passo D — guard:** `KeycloakGuard` confere assinatura do token, issuer, audience, expiração e role. Um token inadequado é rejeitado antes de chegar ao controlador.

**Passo E — DTO:** o `ZodValidationPipe` compara o JSON com as regras declaradas. Uma matrícula vazia, um período inválido ou CR maior que 10 são rejeitados.

**Passo F — controller:** o método `AlunosController.criar(dto)` chama `AlunosService.criar(dto)`.

**Passo G — service:** confirma a existência do curso, verifica os créditos e solicita ao Prisma `aluno.create(...)`.

**Passo H — PostgreSQL:** insere uma linha em `Aluno` e devolve o objeto resultante.

**Passo I — React:** após o sucesso, o formulário se fecha e a tabela carrega os alunos novamente. O estudante aparece no resultado.

Esse percurso é o mais importante para compreender o projeto **de ponta a ponta**. Ao conseguir explicar cada passo, vocês terão entendido as principais responsabilidades da arquitetura.

---

## 8. Endpoints disponíveis

Todos os caminhos abaixo têm como prefixo `http://localhost:3000/graduate/api/v1`. Apenas o health check é público; os outros exigem Bearer JWT com role autorizada.

| Método | Caminho | Função |
|---|---|---|
| GET | `/health` | Informa se o processo HTTP está respondendo |
| GET | `/painel` | Total de alunos, atenção, possível EP e CR médio |
| GET | `/cursos` | Lista cursos e contagens |
| GET | `/disciplinas` | Lista disciplinas e contagens de tentativas |
| GET | `/disciplinas?cursoId=UUID` | Filtra disciplinas de um curso |
| GET | `/alunos` | Lista alunos |
| GET | `/alunos?busca=ana` | Busca por nome, matrícula ou e-mail |
| GET | `/alunos?cursoId=UUID&situacao=ATENCAO` | Filtra curso e triagem |
| GET | `/alunos/:id` | Dados completos, histórico e atendimentos |
| POST | `/alunos` | Cadastra um aluno |
| POST | `/alunos/importacao` | Importa lote cadastral simplificado |
| POST | `/alunos/:id/tentativas` | Registra nova tentativa de disciplina |
| POST | `/alunos/:id/atendimentos` | Registra ação de acompanhamento |

Os métodos `GET` em geral apenas consultam. Os métodos `POST` produzem novos registros e podem retornar erros de validação, permissão ou conflito.

### 8.1 Exemplo de resposta de aluno

Recorte ilustrativo, sem IDs reais:

```json
{
  "id": "uuid",
  "nome": "Mariana Alves (exemplo)",
  "matricula": "DEMO0001",
  "cr": 6.4,
  "creditosConcluidos": 68,
  "curso": { "nome": "Ciência da Computação", "creditosTotais": 160 },
  "triagem": {
    "situacao": "POSSIVEL_EP",
    "percentualConcluido": 42.5,
    "evidencias": { "duasReprovacoesMesmaDisciplina": true }
  }
}
```

O JSON real inclui outros atributos e a estrutura completa de `evidencias` com campos `null` não avaliados.

### 8.2 O que significa JSON?

É um formato de dados texto que parece um objeto JavaScript. O navegador envia e recebe JSON para trocar informações com a API. JSON tem objetos `{}`, listas `[]`, strings, números, booleanos e `null`. Não tem comentários, funções ou tipos TypeScript.

---

## 9. O que faz cada arquivo de infraestrutura

**`compose.yml`:** define PostgreSQL e Keycloak. Com o perfil opcional `app`, também constrói e roda o backend e frontend. Possui um volume `pgdata` para o banco persistir entre reinicializações.

**`infra/keycloak/graduate-realm.json`:** define o realm `graduate`, clients `graduate-front` e `graduate-api`, papéis de exemplo `NEAP`/`ADMIN` e conta fictícia `neap.demo`. O mapper inclui a audiência da API no access token. É uma configuração local de desenvolvimento, não configuração de segurança pronta para produção.

**`graduate-back/.env.example`:** descreve configurações como URL do banco e emissor Keycloak. Faz-se `cp .env.example .env` para criar um arquivo privado local.

**`graduate-front/.env.example`:** informa onde estão API e Keycloak no navegador. Variáveis iniciadas com `VITE_` são incorporadas ao código do navegador: **nunca ponha segredos nelas**.

**`Dockerfile` de cada aplicação:** define a imagem Node 24, copia arquivos, instala dependências e prepara os comandos de inicialização.

**`package.json`:** descreve dependências e comandos npm. Pense em um manifesto de projeto. `npm install` instala as bibliotecas. `npm run dev` inicia com recarregamento em desenvolvimento.

**`tsconfig.json`:** configura o compilador/verificador TypeScript. A opção `strict` pede uma checagem de tipos mais cuidadosa, como exigir atenção a `null` e tipos não informados.

**`nest-cli.json`:** configura ferramentas do Nest e onde está o código-fonte do backend.

**`vite.config.ts`:** registra o plugin React do Vite e mantém a porta 5173 para desenvolvimento.

**`.gitignore`:** evita versionar dependências instaladas, arquivos de build e `.env` privado.

**`.nvmrc`:** sugere Node 24 ao gerenciador `nvm`.

**`exemplo-importacao.csv`:** arquivo com duas pessoas fictícias e colunas esperadas pelo importador.

**`referencias/prototipo-original.html`:** cópia do HTML enviado originalmente. Guarde como referência visual e de nomenclatura, não como código da aplicação nova.

---

## 10. Comandos e ambiente: por que tantas ferramentas?

Antes de rodar o projeto, Docker deve iniciar serviços externos. `npm` prepara as dependências e inicia cada aplicação. Prisma monta as tabelas e carrega dados.

Primeiro, na pasta raiz:

```bash
docker compose up -d
```

`-d` deixa os containers rodando sem prender o terminal. Isso inicia somente `postgres` e `keycloak`, pois front/back estão sob perfil `app`.

Segundo, no back-end:

```bash
cd graduate-back
cp .env.example .env
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

`npm install` baixa dependências. `prisma:generate` cria o cliente ORM. `db:push` cria/adapta tabelas, `db:seed` popula a base fictícia e `dev` inicia Nest.

Terceiro, no front-end:

```bash
cd graduate-front
cp .env.example .env
npm install
npm run dev
```

O Vite mostra o endereço `http://localhost:5173`. Depois que o Keycloak concluir sua inicialização, o login ficará disponível. Use as credenciais **somente de desenvolvimento** do README.

### 10.1 Alternativa: Docker Compose para tudo

```bash
docker compose --profile app up --build
```

No perfil `app`, além da infraestrutura, sobem os containers `backend` e `frontend`. O backend aplica o schema de desenvolvimento e roda o seed ao subir. Se estiver usando as portas 3000 ou 5173 localmente com `npm run dev`, interrompa esses processos antes de subir o perfil para evitar conflito.

### 10.2 Onde investigar erros comuns

- **`ECONNREFUSED localhost:5432`**: o PostgreSQL não está de pé ou a porta está ocupada.
- **`P1001` no Prisma**: falha de conexão com banco; confira `DATABASE_URL` e `docker compose ps`.
- **`Token ausente`**: front não enviou Bearer JWT, ou login não foi concluído.
- **`Token inválido ou expirado`**: confira URL do realm, chaves JWKS, horário dos processos e audiência `graduate-api` do token.
- **`Perfil sem permissão no NEAP`**: usuário autenticou, mas seu JWT não contém a role esperada.
- **`CORS` no navegador**: verifique `FRONTEND_ORIGIN` no backend; origem deve coincidir exatamente (porta e host).
- **`404` em `/alunos`**: o prefixo existe; confira `/graduate/api/v1/alunos`.
- **Dados não aparecem**: confira se rodou o seed e se os processos estão apontando para o mesmo banco.
- **Porta já em uso**: não execute simultaneamente modo local npm e modo Compose `--profile app`.

---

## 11. Decisões de engenharia: por que não fizemos tudo?

### 11.1 Não implementar SIGAA falsamente

O grupo ainda não forneceu credenciais autorizadas nem documentação de API institucional do SIGAA. Portanto, não faz sentido fingir uma sincronização. O CSV é uma entrada manual controlada; um módulo de integração futura fará autenticação, importação incremental, reconciliação, logs e tratamento de conflitos.

### 11.2 Não automatizar EP além dos dados disponíveis

A regra de dupla reprovação depende de tentativas por disciplina; essas existem no modelo. Porém calcular corretamente *todos* os componentes em que o aluno esteve matriculado no semestre, CR de dois semestres e esgotamento do prazo exige dados adicionais e interpretação normativa oficial. O sistema sinaliza `null` para critérios não avaliados.

### 11.3 Não inferir risco com modalidade de ingresso

O grupo levantou forma de ingresso e notas de seleção como variáveis de análise. Não usamos modalidade/cotas como regra automática de risco ou concessão de EP. Essa variável pode ser útil para análises estatísticas institucionalmente autorizadas, mas exige cuidado com finalidade, viés e privacidade.

### 11.4 Não calcular CR automaticamente a partir de três disciplinas

O protótipo exibiu CR global e histórico parcial. A equipe não deve concluir que aqueles três registros bastam para recalcular o CR oficial. O MVP separa “CR informado” das “tentativas registradas” e mantém essa limitação visível.

### 11.5 Não criar mecanismos de IA ou previsão de evasão agora

O objetivo do trabalho inicial é representar e organizar dados acadêmicos e oferecer consultas úteis. Um classificador preditivo adicionaria incertezas estatísticas, vieses, questões éticas e dependência de histórico adequado sem necessidade para validar o MVP.

### 11.6 Por que usamos Prisma em vez de TypeORM?

A documentação detalhada atual do starter NestJS dos CInCoders usa Prisma para schema, migrations, services e exemplos de módulos. Embora a página inicial mencione TypeORM, privilegiamos a documentação operacional detalhada, evitando misturar dois ORMs sem justificativa.

### 11.7 Por que CSS próprio em vez de importar o design system Cinnamon?

O boilerplate React dos CInCoders usa `@cincoders/cinnamon`. Como o código do repositório oficial não estava disponível para clonagem neste ambiente e o objetivo é aprender a stack mantendo a identidade do HTML fornecido, a versão entregue usa CSS simples. Esse CSS pode ser substituído progressivamente pelos componentes Cinnamon ao colocar os módulos sobre o boilerplate oficial. Não apresentamos a implementação como clone fiel do template.

### 11.8 Por que não criar testes nem CI?

O pedido do grupo foi explicitamente por uma versão inicial sem testes. A estrutura não inclui pastas `__tests__`, scripts de teste ou pipelines de CI. A equipe deve adicionar validação e testes em etapas seguintes, antes de utilizar informações acadêmicas reais ou apresentar o produto como confiável para operações institucionais.

---

## 12. Conexão posterior com o boilerplate oficial dos CInCoders

O material oficial descreve um gerador que cria front/back a partir da base da plataforma:

```bash
curl -fsSL https://gitlab.cin.ufpe.br/cincoders/platform/boilerplate/-/raw/main/setup.sh | bash
```

Esse comando deve ser lido e executado por vocês, em ambiente autorizado. **Não foi executado na produção deste pacote.** O gerador cria os projetos reais com configurações próprias, integração com Keycloak, estruturas transversais, scripts e design system já fornecidos pela equipe de apoio.

Ao receber o repositório oficial, a proposta de integração é:

1. Criar um novo projeto pelo script da plataforma (em outra pasta).
2. Comparar `schema.prisma` do Graduate com o gerado e mesclar **models**, sem substituir modelos de infraestrutura existentes.
3. Copiar os módulos de negócio `alunos`, `cursos`, `disciplinas` e `painel` para `src/modules/` do backend oficial, adaptando os imports às funções `PrismaService`, DTOs, interceptors e erros do template.
4. Registrar cada módulo em `AppModule` oficial e usar o **AuthModule** do template, não instalar um segundo guard sobre o existente.
5. No React oficial, adaptar `src/modules/*` do Graduate para o `fetchApi`, `useAsync`, rotas, layout `PageCin` e `AuthProvider` oficiais, aproveitando o sistema Cinnamon se o grupo decidir.
6. Conectar URLs do front ao prefixo gerado e verificar as roles configuradas pelo gerador, que podem usar nomes diferentes de `NEAP` e `ADMIN`.

Essa abordagem preserva o trabalho de domínio já desenvolvido sem tentar substituir a infraestrutura padronizada dos CInCoders. A equipe deve evitar simplesmente copiar pastas inteiras sobre o boilerplate oficial, pois isso apagaria arquivos úteis do starter.

---

## 13. Quando o MVP funciona? Pequeno roteiro para o grupo demonstrar

Este roteiro descreve **comportamento esperado**, não resultado validado neste ambiente.

1. Iniciar banco, Keycloak, backend e frontend.
2. Logar como `neap.demo` e abrir o painel: os números devem refletir os registros fictícios.
3. Abrir Alunos e buscar `DEMO0001`. Conferir o progresso de 68/160 créditos e o histórico de Cálculo I com duas reprovações.
4. Abrir o prontuário, aba EP: deve aparecer “Indício identificado” somente para o critério implementado, enquanto os outros aparecem como “Não avaliado”.
5. Abrir aba Atendimentos e registrar uma orientação simples. A página deve exibir data e usuário que gravou o registro.
6. Abrir outra pessoa da lista com apenas uma reprovação. A triagem deve indicar “Em atenção”, não “Possível EP” pela regra de repetência.
7. Importar `exemplo-importacao.csv`; o número total de alunos cadastrados deve aumentar em duas unidades se as matrículas ainda não existirem.
8. Abrir Disciplinas e observar como as tentativas são contadas por componente.

Não usar dados reais de estudantes nessa demonstração. Documentar separadamente os eventuais ajustes feitos após a primeira execução.

---

## 14. Como dividir o estudo com os colegas

Sugestão de aprendizagem por responsabilidade, não divisão rígida do código:

- **Banco + domínio:** entender `schema.prisma`, `seed.ts`, `triagem.ts` e regras de negócio.
- **API:** entender modules/controllers/services, DTOs, validação e Prisma.
- **Front-end:** estudar JSX, estados, `useAsync`, componentes e formulários.
- **Integração:** compreender token Keycloak, HTTP, Docker Compose, variáveis de ambiente e rotas.

A regra mais importante é: cada pessoa precisa ser capaz de contar o fluxo **React → API → Prisma → PostgreSQL** mesmo que se aprofunde em um módulo específico.

---

## 15. Perguntas de compreensão para orientar seu estudo (não são testes automatizados)

**1. Por que um aluno e uma disciplina não estão conectados diretamente por um único campo?** Porque precisamos representar várias tentativas no decorrer dos semestres. A relação passa pela entidade `Tentativa`.

**2. Por que a matrícula não é a chave primária?** Porque usamos um UUID interno estável nas relações, mantendo a matrícula como atributo único de negócio.

**3. Por que o React não consulta o banco diretamente?** Para concentrar autenticação, validação, regras de negócio e persistência no backend.

**4. Qual é o papel de `@Controller('alunos')`?** Definir a parte da URL das rotas do domínio Alunos.

**5. O que o `@Injectable()` faz?** Permite ao framework construir e injetar o service como dependência.

**6. Se escondo um botão, isso impede chamadas indevidas?** Não. A verificação deve ocorrer novamente no guard e no backend.

**7. O que `await` faz?** Aguarda a conclusão de uma Promise na execução daquela função assíncrona.

**8. Por que a interface muda depois de `setBusca`?** Porque `useState` notifica ao React que o estado mudou e a página deve renderizar novamente.

**9. Por que um critério não avaliado retorna `null`, e não `false`?** Porque insuficiência de dados não pode ser confundida com resultado negativo.

**10. Se o CR do aluno for 2,8, o MVP pode conceder EP?** Não. Nem todos os critérios ou semestres foram verificados; a decisão é institucional e humana.

**11. Qual é a diferença entre `npm run dev` e `docker compose up`?** O primeiro inicia uma aplicação Node; o segundo orquestra serviços/containers descritos no YAML.

**12. Por que salvar um histórico novo não muda automaticamente o CR?** Porque ainda não há garantia de histórico completo nem especificação oficial do cálculo.

**13. Por que a importação de CSV usa transação?** Para evitar importação parcial quando uma linha do lote é inválida ou conflita com registros existentes.

**14. Por que `useAsync` tem um contador de geração?** Para evitar que requisições antigas, concluídas depois de uma busca nova, substituam os dados atuais na tela.

**15. Como levaríamos esse projeto ao boilerplate oficial?** Mesclando os módulos de negócio no projeto gerado, preservando infraestrutura padrão, segurança e convenções do starter.

---

## 16. A próxima evolução sensata

Uma sequência técnica e pedagógica possível após a primeira execução do MVP seria:

**Etapa 1 — estabilização:** definir convenções do repositório, revisar conflitos de versões, formalizar contratos API, usar migrations Prisma e documentar os ajustes de execução.

**Etapa 2 — requisitos NEAP:** consolidar matrizes curriculares reais, semestres e normas vigentes de EP com documentação validada pelo núcleo; formalizar o que é “em acompanhamento”, “em risco” e “elegível”.

**Etapa 3 — importação séria:** planejar interface autorizada SIGAA ou importação de planilha institucional, com log de origem, validação dos campos e tratamento de registros alterados.

**Etapa 4 — indicadores confiáveis:** implementar histórico semestral completo, cálculo formal de CR, frequência e integralização, além de acompanhar encaminhamentos e resultados das ações.

**Etapa 5 — robustez:** papéis mais granulares, paginação, auditoria, backups, políticas de retenção, observabilidade, testes e deployment institucional.

A meta não é empilhar recursos, mas reduzir a distância entre a pergunta do NEAP e o dado necessário para respondê-la com segurança.

---

## 17. Referências do material e limites de confirmação

Este trabalho foi formulado com base no HTML do grupo, nas capturas de reunião do NEAP, requisitos iniciais, histórias de usuário, catálogo de projetos da disciplina e as páginas de documentação dos dois starter kits dos CInCoders.

**Documentação técnica externa:**

- NestJS setup: https://cincoders-nestjs-starterkit.vercel.app/docs/setup/quick-start
- NestJS arquitetura: https://cincoders-nestjs-starterkit.vercel.app/docs/architecture/overview
- NestJS módulos: https://cincoders-nestjs-starterkit.vercel.app/docs/guides/module-scaffolding
- React setup: https://cincoders-reactjs-starterkit.vercel.app/docs/setup/quick-start
- React arquitetura: https://cincoders-reactjs-starterkit.vercel.app/docs/architecture/overview
- React módulos: https://cincoders-reactjs-starterkit.vercel.app/docs/guides/module-scaffolding

**Nota sobre a documentação:** os endpoints `.mdx` indicados pelo grupo foram tentados, mas não estavam disponíveis em formato diretamente processável pelo visualizador usado. As mesmas seções foram consultadas por suas páginas HTML oficiais. Os scripts de geração e os repositórios GitLab originais não foram clonados. Não confunda esse pacote novo, compatível **em conceitos e stack**, com os bytes do starter kit gerado oficialmente.

**Uso de dados:** nomes demonstrativos e identificadores `DEMO...` neste projeto são fictícios. Não há acesso institucional ao SIGAA nem garantia de validade normativa dos critérios de EP além da necessidade de triagem humana. O NEAP deve revisar as regras antes de qualquer uso operacional.
