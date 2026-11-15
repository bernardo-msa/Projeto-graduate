# Graduate — Inventário quantitativo de partições e limites (auditoria estática)

**Data:** 15/11/2026  |  **Escopo:** US01, US02, US03; `v1-llm` e `v2` recebidos em `auditoria-quantitativa-final.zip`.

## Método e denominadores

Esta auditoria **não executou o Vitest**: inspecionou entradas, resultados esperados e asserções nos arquivos fornecidos. O usuário apresentou anteriormente a execução de **33 testes na v1** e de **119 testes em nove arquivos da v2**, todos aprovados, com **100% de linhas e 98,41% de branches** no escopo instrumentado.

Para evitar misturar unidades diferentes, o inventário define: **P** = representante nominal de classe/condição de equivalência (inclui formato, categoria, presença/ausência, combinações); **L** = valor numérico de fronteira explicitamente listado. Uma unidade é contada como verificada se há entrada para aquele representante e asserção ligada ao resultado; o simples uso num fixture sem asserção relevante não basta. Quando o serviço e o schema são níveis distintos, foi exigida evidência na camada declarada pelo caso. Não se confundem representantes e conjunto matemático completo de todas as entradas.

Foram inventariadas as **24 famílias originalmente descritas** e a família complementar **CAD-F10**, que contempla o requisito de modalidade com máximo de 90 caracteres. Nos casos de distribuição, unicidade e relacionamentos, contam-se representantes categóricos específicos; nas faixas numéricas com limites declarados, contam-se os valores individuais. Essa escolha fixa o denominador para comparação de v1 e v2. Casos adicionais, como tipos inválidos citados genericamente sem valores representantes próprios, não foram transformados artificialmente em valores de fronteira; permanecem como ressalva de completude da especificação.

**Legenda de evidência:** o nome do arquivo `.test.ts` aponta a suíte correspondente (em `graduate-back/tests/v1-llm/` ou `graduate-back/tests/v2/`). `—` = não foi encontrada asserção específica do representante na v1. Para a v2, a tabela aponta um arquivo da v2, inclusive quando o conteúdo foi originalmente herdado da v1.

## Resultado por unidade

| Métrica | v1: verificados / previstos | v1 (%) | v2: verificados / previstos | v2 (%) |
|---|---:|---:|---:|---:|
| Representantes de equivalência / condição | 28/50 | 56.00% | 50/50 | 100.00% |
| Valores de fronteira declarados | 11/39 | 28.21% | 39/39 | 100.00% |
| **Total de representantes** | **39/89** | **43.82%** | **89/89** | **100.00%** |

## Inventário por família (rastreável)

| Família | Tipo | Representante auditado | v1 (evidência) | v2 (evidência) |
|---|:---:|---|---|---|
| EP-F01 | L | 0 reprovações | triagem.test.ts | auditoria-cenarios-parciais.test.ts |
| EP-F01 | L | 1 reprovação | triagem.test.ts | triagem.test.ts |
| EP-F01 | L | 2 reprovações | triagem.test.ts | triagem.test.ts |
| EP-F01 | L | 3 reprovações | — | lacunas-triagem.test.ts |
| EP-F02 | P | mesma disciplina | triagem.test.ts | triagem.test.ts |
| EP-F02 | P | disciplinas distintas | triagem.test.ts | triagem.test.ts |
| EP-F03 | P | obrigatória | triagem.test.ts | auditoria-cenarios-parciais.test.ts |
| EP-F03 | P | optativa | triagem.test.ts | auditoria-cenarios-parciais.test.ts |
| EP-F04 | P | reprovação por nota | triagem.test.ts | triagem.test.ts |
| EP-F04 | P | reprovação por falta | triagem.test.ts | triagem.test.ts |
| EP-F04 | P | não reprovação (APROVADO) | triagem.test.ts | triagem.test.ts |
| EP-F05 | L | 0 créditos totais | triagem.test.ts | triagem.test.ts |
| EP-F05 | L | 160 créditos totais | triagem.test.ts | triagem.test.ts |
| EP-F06 | L | 0 concluídos | — | lacunas-triagem.test.ts |
| EP-F06 | L | 68 concluídos | triagem.test.ts | triagem.test.ts |
| EP-F06 | L | 160 concluídos | — | lacunas-triagem.test.ts |
| EP-F06 | L | 161 concluídos | — | auditoria-cenarios-parciais.test.ts |
| EP-F07 | P | percentual exato 68/160 | triagem.test.ts | triagem.test.ts |
| EP-F07 | P | arredondamento 1/160 | — | lacunas-triagem.test.ts |
| CAD-F01 | L | matrícula 3 | cadastro-alunos.test.ts | limites-adicionais.test.ts |
| CAD-F01 | L | matrícula 4 | — | limites-adicionais.test.ts |
| CAD-F01 | L | matrícula 30 | — | limites-adicionais.test.ts |
| CAD-F01 | L | matrícula 31 | — | limites-adicionais.test.ts |
| CAD-F01 | P | trim da matrícula | — | auditoria-cenarios-parciais.test.ts |
| CAD-F02 | L | nome 2 | — | limites-adicionais.test.ts |
| CAD-F02 | L | nome 3 | — | limites-adicionais.test.ts |
| CAD-F02 | L | nome 150 | — | limites-adicionais.test.ts |
| CAD-F02 | L | nome 151 | — | limites-adicionais.test.ts |
| CAD-F03 | L | CR -0,1 | — | limites-adicionais.test.ts |
| CAD-F03 | L | CR 0 | — | limites-adicionais.test.ts |
| CAD-F03 | L | CR 10 | — | limites-adicionais.test.ts |
| CAD-F03 | L | CR 10,1 | — | limites-adicionais.test.ts |
| CAD-F04 | L | créditos -1 | cadastro-alunos.test.ts | limites-adicionais.test.ts |
| CAD-F04 | L | créditos 0 | — | limites-adicionais.test.ts |
| CAD-F04 | L | créditos 1 | — | limites-adicionais.test.ts |
| CAD-F04 | L | créditos 1,5 | cadastro-alunos.test.ts | limites-adicionais.test.ts |
| CAD-F05 | P | período 2026.1 | cadastro-alunos.test.ts | limites-adicionais.test.ts |
| CAD-F05 | P | período 2026.2 | — | limites-adicionais.test.ts |
| CAD-F05 | P | período 2026.3 | cadastro-alunos.test.ts | limites-adicionais.test.ts |
| CAD-F05 | P | período 26.1 | — | limites-adicionais.test.ts |
| CAD-F06 | P | email omitido | — | limites-adicionais.test.ts |
| CAD-F06 | P | email vazio | — | limites-adicionais.test.ts |
| CAD-F06 | P | email válido | cadastro-alunos.test.ts | limites-adicionais.test.ts |
| CAD-F06 | P | email inválido | cadastro-alunos.test.ts | limites-adicionais.test.ts |
| CAD-F07 | P | UUID válido/curso existente | cadastro-alunos.test.ts | cadastro-alunos.test.ts |
| CAD-F07 | P | UUID válido/curso inexistente | cadastro-alunos.test.ts | cadastro-alunos.test.ts |
| CAD-F07 | P | UUID inválido | — | limites-adicionais.test.ts |
| CAD-F08 | L | 159 de 160 | — | fronteiras-pendentes.test.ts |
| CAD-F08 | L | 160 de 160 | — | limites-creditos-curso.test.ts |
| CAD-F08 | L | 161 de 160 | — | limites-creditos-curso.test.ts |
| CAD-F09 | P | matrícula inédita | cadastro-alunos.test.ts | cadastro-alunos.test.ts |
| CAD-F09 | P | matrícula duplicada P2002 | cadastro-alunos.test.ts | cadastro-alunos.test.ts |
| CAD-F10 | L | modalidade 90 caracteres | — | limites-modalidade-ingresso.test.ts |
| CAD-F10 | L | modalidade 91 caracteres | — | limites-modalidade-ingresso.test.ts |
| CAD-F10 | P | trim da modalidade (90 + espaços) | — | limites-modalidade-ingresso.test.ts |
| TEN-F01 | L | nota -0,1 | registro-tentativas.test.ts | limites-adicionais.test.ts |
| TEN-F01 | L | nota 0 | — | limites-adicionais.test.ts |
| TEN-F01 | L | nota 10 | — | limites-adicionais.test.ts |
| TEN-F01 | L | nota 10,1 | registro-tentativas.test.ts | limites-adicionais.test.ts |
| TEN-F01 | P | nota null no schema | — | fronteiras-pendentes.test.ts |
| TEN-F01 | P | nota omitida no schema | — | fronteiras-pendentes.test.ts |
| TEN-F02 | L | frequência -0,1 | — | limites-adicionais.test.ts |
| TEN-F02 | L | frequência 0 | — | limites-adicionais.test.ts |
| TEN-F02 | L | frequência 100 | — | limites-adicionais.test.ts |
| TEN-F02 | L | frequência 100,1 | — | limites-adicionais.test.ts |
| TEN-F02 | P | frequência null no schema | — | fronteiras-pendentes.test.ts |
| TEN-F02 | P | frequência omitida no schema | — | fronteiras-pendentes.test.ts |
| TEN-F03 | P | período 2026.1 | registro-tentativas.test.ts | limites-adicionais.test.ts |
| TEN-F03 | P | período 2026.2 | — | limites-adicionais.test.ts |
| TEN-F03 | P | período 2026.3 | registro-tentativas.test.ts | registro-tentativas.test.ts |
| TEN-F03 | P | período 20261 | — | fronteiras-pendentes.test.ts |
| TEN-F04 | P | APROVADO | registro-tentativas.test.ts | limites-adicionais.test.ts |
| TEN-F04 | P | REPROVADO_NOTA | — | limites-adicionais.test.ts |
| TEN-F04 | P | REPROVADO_FALTA | — | limites-adicionais.test.ts |
| TEN-F04 | P | CURSANDO | registro-tentativas.test.ts | limites-adicionais.test.ts |
| TEN-F04 | P | TRANCADO | — | limites-adicionais.test.ts |
| TEN-F04 | P | DESISTENTE rejeitada | — | fronteiras-pendentes.test.ts |
| TEN-F05 | P | aluno existente | registro-tentativas.test.ts | registro-tentativas.test.ts |
| TEN-F05 | P | aluno ausente | registro-tentativas.test.ts | registro-tentativas.test.ts |
| TEN-F06 | P | disciplina válida do curso | registro-tentativas.test.ts | registro-tentativas.test.ts |
| TEN-F06 | P | disciplina inexistente | — | servicos-adicionais.test.ts |
| TEN-F06 | P | disciplina de outro curso | registro-tentativas.test.ts | registro-tentativas.test.ts |
| TEN-F07 | P | APROVADO sem nota rejeitado | registro-tentativas.test.ts | registro-tentativas.test.ts |
| TEN-F07 | P | REPROVADO_NOTA sem nota rejeitado | — | servicos-adicionais.test.ts |
| TEN-F07 | P | REPROVADO_FALTA sem nota rejeitado | — | servicos-adicionais.test.ts |
| TEN-F07 | P | CURSANDO com nota null aceito | registro-tentativas.test.ts | registro-tentativas.test.ts |
| TEN-F07 | P | TRANCADO com nota null aceito | — | servicos-adicionais.test.ts |
| TEN-F08 | P | tentativa inédita | registro-tentativas.test.ts | registro-tentativas.test.ts |
| TEN-F08 | P | tentativa duplicada P2002 | registro-tentativas.test.ts | registro-tentativas.test.ts |

## Lacuna identificada e posteriormente corrigida

- **CAD-F08 — 160 e 161 créditos concluídos em curso de 160:** a suíte v2 contém aceitação de 12/12 e rejeição de excesso 40/30, mas **não contém os pares literais 160/160 e 161/160** previstos na matriz. Esses dois representantes foram posteriormente verificados em `limites-creditos-curso.test.ts`, com asserções de persistência e rejeição. A verificação de 159/160 já existe em `fronteiras-pendentes.test.ts`.

## Limites de interpretação e pendências de requisitos

- **Mesmo a eventual cobertura de 100% dos representantes deste inventário não significa cobertura universal de todas as entradas possíveis.** A matriz inclui expressões abertas como “tipo incorreto” e “outros formatos” sem especificar um conjunto exaustivo. O indicador se restringe aos representantes explicitamente operacionalizados e aos três de CAD-F10.
- O percentual de classes é **por representante de partição/condição**, não por todas as classes matematicamente disjuntas possíveis. A denominação deve ser informada dessa forma no relatório crítico e não como “cobertura total de todas as partições imagináveis”.
- A classificação das primeiras 119 verificações é uma **inspeção estática** dos testes fornecidos, complementada pela inspeção do arquivo adicional `limites-creditos-curso.test.ts` e pela evidência apresentada da execução de 121/121 testes; para afirmar conformidade institucional dos requisitos de EP é necessária revisão da equipe/NEAP. O caso EP-10 descreve comportamento atual, não regulamento.
- O histórico deve ser preservado: v1 = 33; v2 original = 95; v2 com correções por cenário = 109; com correções de fronteiras = 116; após modalidade = 119 testes.
- O relatório de cobertura estrutural da v2 original com 95 testes (98,46% branches) é diferente do atual com 119 (98,41% branches); a instrumentação pode alterar o denominador. Não substituir o documento histórico.
- Em eventual revisão humana, vale verificar classes não especificadas em detalhe, como string versus número para CR e créditos, matrícula vazia, modalidades com 0 caracteres e comportamentos de integração real (fora do escopo unitário).

## Recomendação de atualização documental

Acrescentar esta tabela como apêndice/ligação na seção 8 da `matriz-rastreabilidade.md` e atualizar **apenas a seção pós-execução**, mantendo intactas as seções 1–7 como registro histórico. Em `auditoria_particoes_limites_sprint3.md`, adicionar o resultado de 119/119 e referenciar este inventário; não apagar a análise anterior de 109 e 116.

## Fechamento após execução da suíte com 121 testes (15/11/2026)

A execução local apresentada pela equipe mostrou **121 testes aprovados em 10 arquivos**. Os dois casos de `limites-creditos-curso.test.ts` cobrem explicitamente os pares **160/160** (persistência permitida) e **161/160** (rejeição antes da persistência), com asserções específicas.

- Representantes de equivalência/condição: **50/50 = 100,00%**.
- Representantes numéricos de fronteira: **39/39 = 100,00%**.
- Total de representantes operacionalizados: **89/89 = 100,00%**.

Os denominadores seguem as definições da seção «Método e denominadores» e **não** significam cobertura exaustiva do domínio ou validação institucional das regras do NEAP. Resultados anteriores (33, 95, 109, 116, 119) permanecem registrados como marcos históricos. A porcentagem de branches **98,41%** é a última capturada antes da inclusão desses dois testes; recomenda-se executar uma última medição para confirmar o valor com 121 testes.
