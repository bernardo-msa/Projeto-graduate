# Auditoria preliminar da rastreabilidade — Sprint 3 (Graduate)

**Base examinada:** matriz original (`docs/testes/matriz-rastreabilidade.md`), 3 arquivos de testes v1, 5 arquivos v2, recebidos no ZIP; métricas de execução fornecidas em capturas pelo estudante. **Não alteramos as suítes.**

**Critério conservador:** E = cenário explicitamente verificável pelas asserções; P = cobertura parcial (algum comportamento/partição, mas não toda a entrada/saída detalhada da linha da matriz); N = cenário específico não localizado. Esta classificação é uma auditoria preliminar por inspeção dos testes, não substitui revisão da equipe nem comprova conformidade com requisitos do NEAP.

## Resultados de execução (módulos selecionados)

| Indicador | v1 | v2 |
|---|---:|---:|
| Testes aprovados | 33/33 | 95/95 |
| Linhas | 61,42% | 100% |
| Branches | 58,46% | 98,46% |
| Funções | 42,85% | 100% |

## Classificação preliminar por cenário da matriz

| Caso | Critério | v1 | v2 | Lacuna relevante / observação |
|---|---|:---:|:---:|---|
| EP-01 | CA01, CA05 | P | P | v1 usa aprovação, não histórico literalmente vazio. |
| EP-02 | CA01, CA05 | P | P | Aprovação e CURSANDO aparecem; TRANCADO não explícito. |
| EP-03 | CA02 | E | E | — |
| EP-04 | CA03 | P | P | Duas reprovações por motivos mistos, não duas por nota. |
| EP-05 | CA03 | N | N | Não foi localizado teste com três reprovações na mesma obrigatória. |
| EP-06 | CA02 | E | E | — |
| EP-07 | CA02, CA04 | P | P | Classificação ATENCAO, sem checagem explícita de quantidade e flag do grupo optativo. |
| EP-08 | CA03, CA05 | E | E | — |
| EP-09 | CA02, CA05 | E | E | — |
| EP-10 | CA03, CA04 | N | N | Não foi localizado cenário duas reprovações seguidas de aprovação. |
| EP-11 | CA04, CA05 | P | P | Agrupamento observado em casos separados; cenário de três tentativas/two grupos e detalhe completo não explícito. |
| EP-12 | CA06 | E | E | — |
| EP-13 | CA06 | N | N | Nenhum teste explícito de 0 concluídos / 160 totais. |
| EP-14 | CA06 | N | N | Nenhum teste explícito de 160/160. |
| EP-15 | CA06 | P | P | Há teste com 170/160 para pendentes zero, mas sem exigir percentual 106,3 ou caso 161/160. |
| EP-16 | CA06 | E | E | — |
| EP-17 | CA06 | N | N | Sem teste explícito do arredondamento de 1/160. |
| EP-18 | CA07 | E | E | — |
| CAD-01 | CA01–CA05 | P | P | — |
| CAD-02 | CA01 | E | E | — |
| CAD-03 | CA01 | P | E | — |
| CAD-04 | CA01 | N | E | — |
| CAD-05 | CA01 | N | E | — |
| CAD-06 | CA01 | P | E | — |
| CAD-07 | CA01 | P | P | Trim demonstrado para nome; matrícula com trim e fronteira não explicitamente verificada. |
| CAD-08 | CA03 | P | E | — |
| CAD-09 | CA03 | P | E | — |
| CAD-10 | CA02 | P | E | — |
| CAD-11 | CA02 | P | E | — |
| CAD-12 | CA02 | N | E | — |
| CAD-13 | CA03 | N | E | — |
| CAD-14 | CA04 | E | E | — |
| CAD-15 | CA04 | N | E | — |
| CAD-16 | CA04 | E | E | — |
| CAD-17 | CA05 | N | E | — |
| CAD-18 | CA06 | E | E | — |
| TEN-01 | CA01, CA05 | E | E | — |
| TEN-02 | CA02 | P | E | — |
| TEN-03 | CA02 | P | E | — |
| TEN-04 | CA01 | P | E | — |
| TEN-05 | CA01 | P | E | — |
| TEN-06 | CA01 | N | E | — |
| TEN-07 | CA03 | E | E | — |
| TEN-08 | CA03 | N | E | — |
| TEN-09 | CA03 | E | E | — |
| TEN-10 | CA04 | P | E | — |
| TEN-11 | CA04, CA05 | E | E | — |
| TEN-12 | CA04, CA05 | N | E | — |
| TEN-13 | CA05 | N | E | — |
| TEN-14 | CA05 | N | P | Frequência omitida com nota 7 não explicitamente testada. |
| TEN-15 | CA06 | E | E | — |

**Contagem preliminar E/P/N:** v1 16/19/16; v2 37/9/5 (sobre 51 linhas de casos, algumas com subcasos).

**Não converter E/51 automaticamente em “cobertura de requisitos”.** O denominador de requisitos é 19 critérios de aceitação; é necessário revisar cada critério como conjunto de obrigações, inclusive os subcasos e fronteiras. Não há base suficiente para declarar a meta de 100% cumprida.

## Pendências realmente prioritárias

1. Revisar EP-05, EP-10, EP-13, EP-14 e EP-17, além de detalhes de EP-02/EP-07/EP-11: testes de triagem não aumentaram da v1 para a v2; portanto o aumento de cobertura estrutural não implica melhora nessas fronteiras.
2. Apreciar explicitamente o comportamento esperado com o NEAP para EP-10 (aprovação posterior).
3. Conferir as linhas P: os testes podem cobrir a decisão, mas não todas as asserções indicadas na matriz.
4. Registrar a comparação como análise crítica; não alterar a v1. Caso novos testes sejam criados, acrescentá-los apenas à v2 e gerar novas medições/commits.
5. Criar `docs/testes/llm-log.md` com prompts efetivamente utilizados, datas/modelo e registros das saídas; não reconstruir prompts fictícios.
6. Entregar relatório crítico PDF de até cinco páginas com evidências numéricas, exemplo concreto de branch não coberto e análise dos oráculos.

## Observação metodológica

A matriz de especificação foi preparada com assistência de IA; o commit anterior à v1 comprova ordem temporal, mas não autoria manual independente. Declarar isso com transparência. A v1 foi gerada sem disponibilizar a matriz como contexto; o protocolo oficial também solicitava fornecer histórias/CA e pedir anotações por técnica/critério, o que não foi integralmente atendido. Apresentar como limitação da experiência, sem edição retroativa da v1.
