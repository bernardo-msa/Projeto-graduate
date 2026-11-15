# Sprint 3 — Matriz de rastreabilidade de testes do Graduate

**Projeto:** Graduate — Currículo e progresso do aluno (NEAP / CIn-UFPE)  
**Versão de referência:** MVP v0.2, antes da geração da suíte de testes por LLM  
**Escopo:** US01 (triagem acadêmica), US02 (cadastro de aluno), US03 (registro de tentativa)  
**Status:** proposta de especificação de testes assistida por IA; validar os critérios com a equipe e com o levantamento do NEAP **antes do commit**.

## 1. Objetivo e método

Esta matriz descreve, antes da geração de testes automatizados, os comportamentos esperados, as partições de equivalência, os valores-limite e os casos de teste das três histórias selecionadas. A avaliação da futura suíte **v1** deverá ser feita comparando os testes gerados com esta matriz, sem fornecê-la à LLM responsável pela geração da v1. A suíte **v2** poderá usar as lacunas identificadas na comparação.

As regras foram conferidas no código-fonte entregue (`graduate-back/src/common/triagem.ts`, `validation.ts` e `graduate-back/src/modules/alunos/alunos.service.ts`). **Isso não substitui a aprovação de requisitos:** especialmente a classificação de EP é apenas triagem preliminar, e não parecer institucional. Os casos que reproduzem comportamento atual devem ser validados pela equipe como expectativas do MVP.

**Níveis de verificação:** `[U]` função pura de triagem; `[V]` validação de entrada por schemas Zod; `[S]` serviço NestJS com Prisma simulado (mock). Casos de exceção do serviço devem verificar a classe da exceção e, quando pertinente, a mensagem; casos válidos devem verificar o retorno ou os dados enviados ao Prisma. Não é necessário acessar PostgreSQL, Keycloak ou SIGAA para esta suíte unitária.

**Convenções:** `REP_NOTA` = `REPROVADO_NOTA`; `REP_FALTA` = `REPROVADO_FALTA`. `D1` = disciplina obrigatória do curso C1; `D2` = outra obrigatória de C1; `D3` = optativa de C1; `D4` = disciplina de C2. UUIDs representados por `UUID_C1`, `UUID_D1` etc. significam **UUIDs sintaticamente válidos e distintos**, substituídos por valores reais nos fixtures. Em cada caso, todos os demais campos são válidos, salvo indicação contrária. O histórico das tentativas é o conjunto já cadastrado e disponível, não necessariamente o histórico integral do SIGAA.

## 2. US01 — Triagem de Estudos Planejados

**História:** Como integrante do NEAP, quero visualizar uma classificação preliminar e os registros que a fundamentam, para priorizar a análise de alunos com dificuldades acadêmicas.

### Critérios de aceitação

- **EP-CA01:** sem tentativas reprovadas por nota ou falta, a classificação é `REGULAR`, com `totalReprovacoes = 0` e lista de reprovações vazia.
- **EP-CA02:** com uma ou mais reprovações, mas **sem duas reprovações na mesma disciplina obrigatória**, a classificação é `ATENCAO`.
- **EP-CA03:** com **duas ou mais** reprovações na **mesma** disciplina obrigatória (por nota e/ou falta), a classificação é `POSSIVEL_EP` e `evidencias.duasReprovacoesMesmaDisciplina = true`.
- **EP-CA04:** tentativas reprovadas são agrupadas pela identidade da disciplina; a resposta preserva código, nome, obrigatoriedade, quantidade, período e motivo das tentativas. Disciplinas optativas aparecem no detalhamento, mas não acionam sozinhas `POSSIVEL_EP`.
- **EP-CA05:** `totalReprovacoes` conta **tentativas**, não disciplinas distintas. Situações `APROVADO`, `CURSANDO` e `TRANCADO` não entram na contagem de reprovações.
- **EP-CA06:** `creditosPendentes = max(0, creditosTotais − creditosConcluidos)`; o percentual é `0` quando `creditosTotais = 0` e, caso contrário, é arredondado para uma casa decimal conforme o cálculo atual. São valores derivados dos registros cadastrais, não de recálculo automático pelo histórico.
- **EP-CA07:** os três critérios adicionais de EP (`todasReprovadasUltimoSemestre`, `crBaixoDoisSemestres`, `prazoIntegralizacao`) permanecem `null`/não avaliados; a saída inclui aviso de triagem preliminar.

### Partições de equivalência e fronteiras

| Variável/condição | Partições relevantes | Fronteiras/representantes |
|---|---|---|
| Reprovações numa mesma obrigatória | nenhuma; exatamente uma; duas ou mais | **0, 1, 2, 3** |
| Distribuição de reprovações | mesma disciplina; disciplinas distintas | D1 + D1 vs. D1 + D2 |
| Obrigatoriedade | obrigatória; optativa | D1 vs. D3 |
| Motivo da tentativa | reprovação por nota; reprovação por falta; não reprovação | REP_NOTA, REP_FALTA, APROVADO |
| Total de créditos do curso | zero; positivo | 0 e 160 |
| Créditos concluídos | zero; intermediário; total; excedente em dado inconsistente | 0, 68, 160, 161 para total 160 |
| Percentual | fração exata; fração que exige arredondamento | 68/160 = 42,5%; 1/160 = 0,625% → 0,6% |

### Casos de teste

| ID | Critério(s) | Entrada / preparação | Resultado esperado | Nível |
|---|---|---|---|---|
| EP-01 | CA01, CA05 | Histórico vazio | `REGULAR`, total 0, detalhamento vazio, evidência `false` | U |
| EP-02 | CA01, CA05 | Uma tentativa `APROVADO` em D1; outra `CURSANDO` em D2; outra `TRANCADO` em D3 | `REGULAR`, total 0 | U |
| EP-03 | CA02 | Uma REP_NOTA em D1 | `ATENCAO`, total 1, evidência `false` | U |
| EP-04 | CA03 | Duas REP_NOTA em D1, em períodos distintos | `POSSIVEL_EP`, total 2, evidência `true`, quantidade de D1 = 2 | U |
| EP-05 | CA03 | Três reprovações em D1 | `POSSIVEL_EP`, quantidade de D1 = 3 | U |
| EP-06 | CA02 | Uma reprovação em D1 e outra em D2 | `ATENCAO`, total 2, nenhum grupo com quantidade 2 | U |
| EP-07 | CA02, CA04 | Duas reprovações em D3, optativa | `ATENCAO`, grupo D3 com quantidade 2 e `obrigatoria = false` | U |
| EP-08 | CA03, CA05 | REP_NOTA e REP_FALTA em D1 | `POSSIVEL_EP`, total 2, ambas as situações detalhadas | U |
| EP-09 | CA02, CA05 | REP_NOTA em D1 seguida de `APROVADO` na mesma disciplina | `ATENCAO`, total 1 (aprovação não conta como reprovação) | U |
| EP-10 | CA03, CA04 | Duas reprovações históricas em D1 e aprovação posterior em D1 | **Comportamento atual:** `POSSIVEL_EP`, total 2; **validar com NEAP** a adequação institucional dessa regra histórica | U |
| EP-11 | CA04, CA05 | REP_NOTA em D1, REP_FALTA em D3, REP_NOTA em D1 | Total 3; dois grupos; D1 = 2, D3 = 1; períodos e motivos preservados | U |
| EP-12 | CA06 | Curso 160 créditos, concluídos 68, sem reprovações | Pendentes 92; percentual 42,5 | U |
| EP-13 | CA06 | Curso 160 créditos, concluídos 0 | Pendentes 160; percentual 0 | U |
| EP-14 | CA06 | Curso 160 créditos, concluídos 160 | Pendentes 0; percentual 100 | U |
| EP-15 | CA06 | Curso 160 créditos, concluídos 161 (fixture deliberadamente inconsistente) | Pendentes 0; percentual conforme fórmula atual: 100,6. **Não** pressupor que a triagem valida o cadastro | U |
| EP-16 | CA06 | Curso com `creditosTotais = 0` | Percentual 0; pendentes 0 se concluídos 0; sem divisão por zero | U |
| EP-17 | CA06 | Curso 160 créditos, concluídos 1 | Percentual 0,6; pendentes 159 | U |
| EP-18 | CA07 | Qualquer histórico válido | Três critérios não implementados = `null`; aviso presente e não conclusivo | U |

**Questão de requisito a validar:** uma aprovação posterior não elimina do histórico as duas reprovações anteriores. O caso EP-10 verifica o comportamento atual da triagem, **não** demonstra que esse é o entendimento regulamentar definitivo do NEAP.

## 3. US02 — Cadastro de aluno

**História:** Como integrante autorizado do NEAP, quero cadastrar um aluno com dados acadêmicos válidos, para registrar e consultar seu progresso curricular.

### Critérios de aceitação

- **CAD-CA01:** `matricula` é string, com trim e comprimento entre **4 e 30** caracteres; `nome` é string, com trim e comprimento entre **3 e 150**.
- **CAD-CA02:** `cursoId` deve ser UUID válido; `periodoIngresso` deve seguir `AAAA.1` ou `AAAA.2`; `email`, quando informado e não vazio, deve ser válido; `modalidadeIngresso` tem no máximo 90 caracteres.
- **CAD-CA03:** CR entre **0 e 10** (inclusive), numérico; `creditosConcluidos` inteiro maior ou igual a zero. Os valores padrão dos campos omitidos são definidos no schema: CR = 0, créditos = 0, modalidade = `Não informada`.
- **CAD-CA04:** o curso indicado deve existir e os créditos concluídos não podem ultrapassar `curso.creditosTotais`.
- **CAD-CA05:** um cadastro válido deve persistir os campos esperados; email vazio é armazenado como `null` pelo serviço.
- **CAD-CA06:** matrícula duplicada, representada por erro de unicidade Prisma `P2002`, deve resultar em `ConflictException`.

### Partições de equivalência e fronteiras

| Campo / regra | Válidas | Inválidas | Valores-limite / representantes |
|---|---|---|---|
| Matrícula (após trim) | 4–30 caracteres | 0–3 ou 31+ | **3, 4, 30, 31**; espaços nas pontas |
| Nome (após trim) | 3–150 caracteres | 0–2 ou 151+ | **2, 3, 150, 151** |
| CR | número entre 0 e 10 | abaixo de 0, acima de 10, tipo incorreto | **-0,1; 0; 10; 10,1** |
| Créditos concluídos | inteiros ≥ 0 | negativo, fracionário, tipo incorreto | **-1; 0; 1; 1,5** |
| Período | `AAAA.1` e `AAAA.2` | outros formatos/semestres | `2026.1`, `2026.2`, `2026.3`, `26.1` |
| Email | ausente, vazio ou endereço válido | endereço malformado | ausente, `''`, `a@exemplo.com`, `invalido` |
| Curso | UUID existente | UUID inválido, UUID válido inexistente | distinguir erro de formato de erro de existência |
| Relação créditos/curso | concluídos ≤ total | concluídos > total | total 160: **159, 160, 161** |
| Matrícula única | não cadastrada | já cadastrada | erro Prisma `P2002` |

### Casos de teste

| ID | Critério(s) | Entrada / preparação | Resultado esperado | Nível |
|---|---|---|---|---|
| CAD-01 | CA01–CA05 | Cadastro completo válido, curso C1 existente (160 créditos), 68 concluídos, CR 6,4 | Schema aceita; serviço cria aluno com os dados esperados | V+S |
| CAD-02 | CA01 | Matrícula de 3 caracteres | Schema rejeita | V |
| CAD-03 | CA01 | Matrícula de 4 caracteres | Schema aceita | V |
| CAD-04 | CA01 | Matrícula de 30 caracteres | Schema aceita | V |
| CAD-05 | CA01 | Matrícula de 31 caracteres | Schema rejeita | V |
| CAD-06 | CA01 | Nome com 2 / 3 / 150 / 151 caracteres (quatro subcasos) | Rejeita 2 e 151; aceita 3 e 150 | V |
| CAD-07 | CA01 | Matrícula e nome com espaços nas pontas | Schema remove espaços antes da checagem; resultado obedece aos limites após trim | V |
| CAD-08 | CA03 | CR -0,1 / 0 / 10 / 10,1 (quatro subcasos) | Rejeita extremos externos; aceita 0 e 10 | V |
| CAD-09 | CA03 | Créditos -1 / 0 / 1 / 1,5 (quatro subcasos) | Rejeita -1 e 1,5; aceita 0 e 1 | V |
| CAD-10 | CA02 | Período `2026.1`, `2026.2`, `2026.3`, `26.1` | Dois primeiros aceitos; demais rejeitados | V |
| CAD-11 | CA02 | Email ausente / `''` / válido / malformado | Três primeiros aceitos; malformado rejeitado | V |
| CAD-12 | CA02 | `cursoId` com valor não UUID | Schema rejeita | V |
| CAD-13 | CA03 | Omitir CR, créditos e modalidade | Schema aplica padrões 0, 0 e `Não informada` | V |
| CAD-14 | CA04 | UUID válido, mas curso não existe no Prisma | `BadRequestException('Curso inexistente')`; não cria aluno | S |
| CAD-15 | CA04 | Curso com 160 créditos; aluno com 160 concluídos | Cadastro aceito | S |
| CAD-16 | CA04 | Curso com 160 créditos; aluno com 161 concluídos | `BadRequestException`; não cria aluno | S |
| CAD-17 | CA05 | Email vazio em cadastro válido | `prisma.aluno.create` recebe `email: null` | S |
| CAD-18 | CA06 | `prisma.aluno.create` falha com Prisma `P2002` | `ConflictException('Matrícula já cadastrada')` | S |

**Observação:** limites de tamanho e formato são responsabilidade do schema (`CreateAlunoSchema`); existência de curso, comparação com créditos do curso e tratamento de duplicidade são responsabilidade do `AlunosService`. Não se deve afirmar que o serviço sozinho rejeita entradas fora do schema quando chamado diretamente em testes unitários.

## 4. US03 — Registro de tentativa de disciplina

**História:** Como integrante autorizado do NEAP, quero registrar a tentativa de uma disciplina por período, com situação e informações acadêmicas, para manter o histórico do aluno atualizado.

### Critérios de aceitação

- **TEN-CA01:** `disciplinaId` é UUID; `periodo` segue `AAAA.1` ou `AAAA.2`; `situacao` pertence ao conjunto permitido (`APROVADO`, `REPROVADO_NOTA`, `REPROVADO_FALTA`, `CURSANDO`, `TRANCADO`).
- **TEN-CA02:** quando informada, a nota está entre **0 e 10**, inclusive; a frequência, entre **0 e 100**, inclusive. Ambas aceitam `null` ou ausência no schema.
- **TEN-CA03:** o aluno deve existir, a disciplina deve existir e pertencer ao mesmo curso do aluno.
- **TEN-CA04:** o serviço exige nota não nula para situações `APROVADO`, `REPROVADO_NOTA` e `REPROVADO_FALTA`; para `CURSANDO` e `TRANCADO` a nota pode ser ausente. O serviço **não infere** a situação automaticamente a partir da nota ou frequência.
- **TEN-CA05:** uma tentativa válida é persistida para aluno, disciplina e período; se nota ou frequência não foram informadas, o serviço envia `null` ao Prisma.
- **TEN-CA06:** duplicidade de tentativa da mesma disciplina no mesmo período, reportada por `P2002`, resulta em `ConflictException`.

### Partições de equivalência e fronteiras

| Campo / condição | Válidas | Inválidas | Valores-limite / representantes |
|---|---|---|---|
| Nota, se presente | 0–10; `null`; ausente no schema | < 0; > 10 | **-0,1; 0; 10; 10,1** |
| Frequência, se presente | 0–100; `null`; ausente | < 0; > 100 | **-0,1; 0; 100; 100,1** |
| Período | `AAAA.1` e `AAAA.2` | período inválido | `2026.1`, `2026.2`, `2026.3`, `20261` |
| Situação | cinco valores do enum | outro valor | `APROVADO`, `REPROVADO_NOTA`, `REPROVADO_FALTA`, `CURSANDO`, `TRANCADO`, `DESISTENTE` |
| Existência de aluno | encontrado | não encontrado | `findUnique` devolve objeto ou `null` |
| Disciplina | existe e é de C1 | inexistente ou é de C2 | D1 vs. D4 |
| Presença de nota por situação | nota obrigatória em 3 situações; opcional em 2 | `null` nas 3 situações concluídas | combinação situação × nota |
| Unicidade | nova combinação aluno-disciplina-período | combinação repetida | erro Prisma `P2002` |

### Casos de teste

| ID | Critério(s) | Entrada / preparação | Resultado esperado | Nível |
|---|---|---|---|---|
| TEN-01 | CA01, CA05 | D1, período `2026.1`, situação `APROVADO`, nota 8, frequência 90 | Schema aceita; serviço persiste tentativa com os campos esperados | V+S |
| TEN-02 | CA02 | Notas -0,1 / 0 / 10 / 10,1 (quatro subcasos) | Rejeita -0,1 e 10,1; aceita 0 e 10 | V |
| TEN-03 | CA02 | Frequências -0,1 / 0 / 100 / 100,1 (quatro subcasos) | Rejeita -0,1 e 100,1; aceita 0 e 100 | V |
| TEN-04 | CA01 | Período `2026.1` / `2026.2` / `2026.3` / `20261` | Aceita os dois primeiros; rejeita os demais | V |
| TEN-05 | CA01 | Cada uma das cinco situações válidas e valor inventado `DESISTENTE` | Aceita as cinco; rejeita valor inventado | V |
| TEN-06 | CA01 | `disciplinaId` não UUID | Schema rejeita | V |
| TEN-07 | CA03 | `prisma.aluno.findUnique` retorna `null` | `NotFoundException('Aluno não encontrado')`; não registra tentativa | S |
| TEN-08 | CA03 | Aluno existe, mas disciplina não existe | `BadRequestException('Disciplina não pertence ao curso do aluno')` | S |
| TEN-09 | CA03 | Aluno do curso C1 e disciplina D4 do curso C2 | Mesma `BadRequestException`; não registra tentativa | S |
| TEN-10 | CA04 | Situação `APROVADO`, nota ausente; repetir com REP_NOTA e REP_FALTA | Para cada uma, `BadRequestException('Informe a nota para disciplinas concluídas')` | S |
| TEN-11 | CA04, CA05 | Situação `CURSANDO`, nota ausente | Serviço aceita e persiste com nota `null` | S |
| TEN-12 | CA04, CA05 | Situação `TRANCADO`, nota `null` | Serviço aceita e persiste com nota `null` | S |
| TEN-13 | CA05 | Situação `APROVADO`, nota = 0 e frequência = 0 | Serviço persiste; não troca situação automaticamente | S |
| TEN-14 | CA05 | Nota válida 7, frequência omitida | Persistência com frequência `null` | S |
| TEN-15 | CA06 | `prisma.tentativa.create` lança `P2002` | `ConflictException('Já existe registro dessa disciplina nesse período')` | S |

**Observação:** o schema aceita nota ausente ou `null`, mas o **serviço** faz a checagem adicional relacionada à situação. Os dois níveis devem ser testados separadamente. Frequência não determina automaticamente reprovação por falta no MVP.

## 5. Consolidação de rastreabilidade

| História | Critérios | Casos definidos | Implementações sob teste |
|---|---|---:|---|
| US01 | EP-CA01 a EP-CA07 | EP-01 a EP-18 (18 casos) | `triagem()` |
| US02 | CAD-CA01 a CAD-CA06 | CAD-01 a CAD-18 (18 linhas; algumas parametrizadas) | `CreateAlunoSchema`, `AlunosService.criar()` |
| US03 | TEN-CA01 a TEN-CA06 | TEN-01 a TEN-15 (15 linhas; algumas parametrizadas) | `CreateTentativaSchema`, `AlunosService.registrarTentativa()` |
| **Total** | **19 critérios** | **51 linhas de casos, com subcasos parametrizados** | **3 áreas funcionais** |

**Nota de escopo:** os 51 casos são uma referência para **avaliar** a suíte gerada, não uma exigência de escrever 51 arquivos ou 51 funções de teste; subcasos podem usar `it.each`/`test.each`. Uma suíte v1 gerada independentemente pode cobrir apenas parte da matriz — isso será identificado na análise crítica. A v2 deve buscar as lacunas priorizadas.

## 6. Quadro de medição (preencher após executar as suítes)

| Indicador | Suíte v1 | Suíte v2 | Evidência |
|---|---|---|---|
| Testes executados | Pendente | Pendente | Saída do Vitest |
| Testes aprovados/falhos | Pendente | Pendente | Saída do Vitest |
| Critérios de aceitação cobertos (de 19) | Pendente | Pendente | Mapear testes para IDs CA |
| Linhas cobertas (%) | Pendente | Pendente | V8 HTML / JSON |
| Branches cobertos (%) | Pendente | Pendente | V8 HTML / JSON |
| Casos/subcasos da matriz exercitados | Pendente | Pendente | IDs EP/CAD/TEN |
| Pontos cegos observados | Pendente | Pendente | Análise crítica |

## 7. Checklist de revisão da equipe antes do commit

- [ ] Conferimos a formulação das histórias com as histórias e requisitos levantados no Miro/NEAP.
- [ ] Revisamos o entendimento de `POSSIVEL_EP` como **triagem**, sem inferir decisão institucional.
- [ ] Validamos especificamente o comportamento histórico de reprovações seguidas de aprovação (EP-10).
- [ ] Conferimos se entradas inválidas devem ser testadas na camada de schema (`V`) ou na camada de serviço (`S`).
- [ ] Confirmamos que os resultados esperados correspondem ao escopo do MVP (sem integração ao SIGAA e sem recálculo automático de CR).
- [ ] Registramos no histórico do trabalho que a redação/estruturação desta matriz teve assistência de IA e revisão da equipe.
- [ ] Salvamos e fizemos o commit desta matriz **antes** de solicitar à LLM a geração da suíte v1.

*Esta matriz é um artefato de projeto pré-teste. As colunas de execução e cobertura permanecerão em branco até haver evidência real dos testes.*
