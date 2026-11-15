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

## Auditoria posterior das duas versões

A inspeção preliminar dos **51 cenários** da matriz apontou na v1 **16 explícitos / 19 parciais / 16 não localizados** e na v2 **37 explícitos / 9 parciais / 5 não localizados**. Essas contagens **não são** automaticamente a taxa de critérios cobertos, pois a matriz contém **19 critérios de aceitação**. Falta validar as classificações e computar separadamente percentuais de critérios, partições e limites. Ver `docs/testes/auditoria_rastreabilidade_v1_v2.md`.

## Pendências de reprodutibilidade e transparência

1. **Anexar as transcrições literais completas** dos prompts e respostas relevantes, exportadas do histórico do ChatGPT, especialmente das rodadas v1/v2. O pedido curto literal acima, isoladamente, não substitui todo o contexto acumulado e não cumpre integralmente a exigência do enunciado.
2. Atualizar a matriz com cobertura de critérios, partições e limites, usando os testes existentes e seus oráculos; distinguir cobertura explícita de parcial.
3. No relatório crítico, reconhecer as divergências em relação ao protocolo: assistência de IA na matriz, ausência de comentários de técnica/critério em parte da v1, ausência de intervenção corretiva por falha na v1.
4. Preservar v1 inalterada e comparar ambas sob a **mesma configuração restrita** (`triagem.ts`, `validation.ts`, `alunos.service.ts`).

**Reprodução local, na pasta `graduate-back`:**

```bash
npx vitest run tests/v1-llm --coverage --coverage.reporter=text
npx vitest run tests/v2 --coverage --coverage.reporter=text
```
