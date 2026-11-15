# Sprint 3 — Log de interação com LLM (Graduate)

**Projeto:** Graduate — NEAP / CIn-UFPE  
**Data das interações:** 15/11/2026  
**LLM utilizada:** ChatGPT, modelo GPT-6 (conforme identificação da sessão).  
**Framework:** Vitest 5.1.0, cobertura V8.  
**Histórico:** conversa do ChatGPT intitulada *Planejamento do MVP Graduate*. Os arquivos entregues e os commits no repositório são os artefatos versionados que documentam as saídas.

> **Nota de integridade documental.** Este arquivo é um índice fiel de etapas e evidências disponíveis, **não uma transcrição integral**. Quando o texto completo de um prompt ou de uma resposta técnica não está reproduzido aqui, ele não foi reconstruído como se fosse literal. Para cumprir integralmente a exigência de 'prompts completos e respostas', anexar/exportar a conversa original como apêndice ou registrar os trechos literais verificáveis. Não declarar que houve geração independente da matriz: a matriz também recebeu assistência de IA e foi revisada pela equipe.

## Preparação anterior à geração

A equipe selecionou US01 (triagem de Estudos Planejados), US02 (cadastro de alunos) e US03 (registro de tentativas). Foi criada e commitada `docs/testes/matriz-rastreabilidade.md` **antes** da v1. A matriz não foi fornecida como entrada à geração da v1; a geração utilizou as implementações e o contexto conversacional dessas três histórias. O escopo e a autoria assistida devem constar no relatório final.

## Rodada 1 — Geração inicial da v1

**Pedido literal do estudante identificado no histórico:**

> chat, vamos fazer a geração da suite v1, não fiz nenhuma arquivo ainda

**Contexto fornecido à LLM:** ZIP do código do Graduate com `src/common/triagem.ts`, `src/common/validation.ts`, `src/modules/alunos/alunos.service.ts`, `prisma/schema.prisma` e `package.json`; fluxo anterior indicando três histórias, Vitest e preservação da v1. A matriz não foi fornecida para derivar os casos nessa etapa.

**Resultado entregue:** `graduate-back/tests/v1-llm/{triagem,cadastro-alunos,registro-tentativas}.test.ts`, acompanhado de `docs/testes/registro-geracao-v1.md`. Primeiro pacote gerado, sem edição manual dos testes posteriormente identificada neste histórico. **Não afirmar que cada teste contém comentário de técnica ou ID do critério: isso não foi implementado sistematicamente.**

**Execução observada pelo estudante:** 3 arquivos, 33 testes aprovados, 0 falhas de teste. Após corrigir o escopo de cobertura para os três módulos das histórias: linhas **61,42%**, branches **58,46%**, funções **42,85%**, instruções **56,25%**.

**Problemas/lacunas:** cobertura parcial de `alunos.service.ts`; ausência de casos explícitos em alguns valores-limite e estados; rastreabilidade teste→critério incompleta nos comentários. Não houve falha de execução a corrigir por nova rodada na v1.

**Evidências:** `tests/v1-llm/`, `docs/testes/registro-geracao-v1.md`, `docs/testes/relatorios/v1/resultado.txt`, `docs/testes/relatorios/v1/index.html`.

## Rodada 2 — Diagnóstico de lacunas e geração da v2

**Contexto da interação:** o estudante executou v1, enviou capturas de execução/cobertura e ZIP incluindo os testes, código e matriz; a LLM comparou casos de testes, matriz e código e gerou complementos. O pedido de v2 decorreu do diálogo de evolução da suíte; o texto integral de todas as instruções intermediárias deve ser consultado no histórico original, não reconstruído neste arquivo.

**Resultado entregue:** `docs/testes/analise-lacunas-v1.md` e `graduate-back/tests/v2/` com três arquivos herdados da v1 e dois novos (`limites-adicionais.test.ts`, `servicos-adicionais.test.ts`). A v2 é **assistida por IA e revisada/executada pelo estudante**; não atribuir todos os casos a implementação manual independente.

**Execução observada:** 5 arquivos, **95 testes aprovados**, 0 falhas. No mesmo escopo restrito: linhas **100%**, branches **98,46%**, funções **100%**, instruções **100%**.

**Limitações identificadas:** 100% de linhas não demonstra cobertura integral de critérios de aceitação. `alunos.service.ts` permaneceu com ramo(s) não exercitado(s). Os testes adicionais de consulta, atendimento e importação excedem parcialmente US01–US03. Há mocks de persistência; não são provas de integração real com PostgreSQL/Keycloak.

**Evidências:** `tests/v2/`, `docs/testes/analise-lacunas-v1.md`, `docs/testes/relatorios/v2/resultado.txt`, `docs/testes/relatorios/v2/index.html`.

## Auditoria posterior — evolução documentada até a v2 auditada

A auditoria inicial dos **51 cenários** da matriz classificou a v1 como **16 explícitos / 19 parciais / 16 sem teste específico**, e a v2 original (95 testes) como **37 explícitos / 9 parciais / 5 sem teste específico**. Essa classificação é histórica, anterior aos complementos; não deve ser descrita como a cobertura final. A matriz possui 19 critérios de aceitação e algumas linhas agrupam subcasos.

As etapas seguintes também foram assistidas por GPT-6 e executadas pelo estudante. Os pedidos abaixo são trechos literais identificáveis na conversa; **não constituem a transcrição completa das respostas da LLM**.

| Marco | Pedido/atividade observável | Evidência de saída | Execução comunicada |
|---|---|---|---|
| 95 → 100 | Auditoria dos cinco cenários não localizados (EP-05, EP-10, EP-13, EP-14, EP-17) | `tests/v2/lacunas-triagem.test.ts` | 100/100 testes aprovados |
| 100 → 109 | Auditoria de nove cenários parciais (EP-01, EP-02, EP-04, EP-07, EP-11, EP-15, CAD-01, CAD-07, TEN-14) | `tests/v2/auditoria-cenarios-parciais.test.ts` | 109/109 aprovados |
| 109 → 116 | Partições/fronteiras planejadas não verificadas especificamente | `tests/v2/fronteiras-pendentes.test.ts` | 116/116 aprovados |
| 116 → 119 | Limite de 90/91 caracteres e `trim()` em `modalidadeIngresso` | `tests/v2/limites-modalidade-ingresso.test.ts` | 119/119 aprovados |
| 119 → 121 | Relação créditos concluídos/curso nos limites 160/160 e 161/160 | `tests/v2/limites-creditos-curso.test.ts` | 121/121 aprovados |

**Pedidos literais identificados no histórico posterior:**

> chat, eu entendo a metodologia pedida, mas dado o tempo acho que seria melhor se você escrevesse o que eu gostaria no teste, pra não perdemos tempo na parte da escrita, eu acho que o que você falou é bem relevante, pense em mais algumas dessas que podem ser relevante, se não houve não precisa, e então monte completamente a matriz de rastreabilidade

> vamos fazer a geração da suite v1, não fiz nenhuma arquivo ainda

> certo chat, antes de tudo, revise essa primeira etapa, veja oq fizemos, pense se falta fazer algo, se tem algo extra que podemos adicionar mas já fizemos o principal, salve na sua memória e dps continuamos, se houve algum ponto chave vamos fazer agora

> chat, aqui esta tudo que fizemos, analise o que era pedido na sprint 3 e veja se ainda falta algo para fazermos

Os pedidos breves como “vamos seguir chat” dependem de contexto anterior; isolá-los como prompts autossuficientes ocultaria as instruções efetivamente utilizadas. Os arquivos gerados pela LLM, o histórico dos commits e a conversa integral devem ser utilizados conjuntamente para reconstruir a interação.

**Resultado final registrado pelo estudante em 15/11/2026:** 10 arquivos de teste, **121 testes aprovados**, cobertura no escopo de três módulos de **100% de linhas, 100% de funções e 98,41% de branches**. O inventário `docs/testes/inventario_particoes_limites_final.md` associa 50 representantes de equivalência/condição e 39 de fronteiras a testes. A conclusão de 100% refere-se **aos 89 representantes inventariados**, não a todo comportamento possível, nem substitui a validação institucional dos oráculos.

**Nota metodológica:** a comparação experimental original é **v1 (33 testes) versus v2 original (95)**. O resultado **121** é uma **v2 posteriormente auditada e complementada**, não a saída inicial da segunda geração. Não reescrever retroativamente os registros da v1 ou da v2 original.

## Pendências de reprodutibilidade e transparência (situação após a auditoria)

1. **Pendente:** anexar/exportar integralmente os prompts, as respostas e os anexos relevantes da conversa original, ou disponibilizar um registro verificável equivalente. Este documento ainda é um índice analítico, não uma transcrição completa; não se deve inventar mensagens ou atribuir textos reconstruídos a prompts literais.
2. **Documentado em artefatos separados:** matriz, auditorias dos 51 cenários, inventário de 89 representantes e relatório crítico final. Preservar a diferença entre critérios de aceitação, cenários, partições e limites.
3. **Ressalvas preservadas:** a matriz teve assistência de IA; parte da v1 não identifica técnica/critério nos comentários; a v1 passou sem rodada de correção por falha; os testes usam mocks de persistência; o comportamento `POSSIVEL_EP` não substitui decisão do NEAP.
4. **Reprodutibilidade:** preservar as duas suítes e os relatórios históricos originais, e registrar separadamente a medição final da v2 auditada.

**Reprodução local, na pasta `graduate-back`:**

```bash
npx vitest run tests/v1-llm --coverage --coverage.reporter=text
npx vitest run tests/v2 --coverage --coverage.reporter=text
```
