# Graduate — Auditoria de partições e valores-limite (15/11/2026)

## Escopo e método

Base documental: `docs/testes/matriz-rastreabilidade.md` (incluindo a seção 8) e os dez arquivos `.test.ts` das suítes `v1-llm` e `v2` recebidos em `auditoria-final-testes.zip`. Esta é uma **inspeção estática das entradas e asserções**, não uma nova execução do Vitest. O usuário já confirmou a execução de 109 testes da v2, todos aprovados.

**Unidade de inspeção nesta tabela:** cada *família de partições/fronteiras*, isto é, cada uma das 24 linhas das três tabelas “Partições de equivalência e fronteiras” da matriz. A família é marcada **completa** somente se os representantes explicitamente listados (e os subcasos que definem a partição) possuem entradas e asserções identificáveis. **Isto NÃO é o percentual formal de cobertura de partições ou limites pedido pelo enunciado:** uma família pode conter várias classes e múltiplos valores de fronteira. Para o indicador formal, é necessário numerar essas unidades individualmente em um inventário normativo.

## Verificação por família (v2)

| ID | Família definida na matriz | Situação | Evidência / lacuna |
|---|---|---|---|
| EP-F01 | Reprovações por obrigatória: 0, 1, 2, 3 | Completa | `auditoria-cenarios-parciais`, `triagem`, `lacunas-triagem` |
| EP-F02 | Mesma disciplina × disciplinas distintas | Completa | `triagem.test.ts` |
| EP-F03 | Obrigatória × optativa | Completa | `triagem` e `auditoria-cenarios-parciais` |
| EP-F04 | REP_NOTA × REP_FALTA × não reprovação | Completa | `triagem` e `auditoria-cenarios-parciais` |
| EP-F05 | Créditos do curso: 0 × 160 | Completa | `triagem.test.ts` |
| EP-F06 | Concluídos: 0, 68, 160, 161 | Completa | `triagem`, `lacunas-triagem`, `auditoria-cenarios-parciais` |
| EP-F07 | Percentual exato × arredondado | Completa | `triagem` (68/160), `lacunas-triagem` (1/160) |
| CAD-F01 | Matrícula: 3, 4, 30, 31 + trim | Completa | `limites-adicionais`, `auditoria-cenarios-parciais` |
| CAD-F02 | Nome: 2, 3, 150, 151 | Completa | `limites-adicionais.test.ts` |
| CAD-F03 | CR: −0,1, 0, 10, 10,1 | Completa | `limites-adicionais.test.ts` |
| CAD-F04 | Créditos: −1, 0, 1, 1,5 | Completa | `limites-adicionais.test.ts` |
| CAD-F05 | Período: 2026.1, 2026.2, 2026.3, 26.1 | Completa | `limites-adicionais.test.ts` |
| CAD-F06 | Email: omitido, vazio, válido, inválido | Completa | `limites-adicionais.test.ts` |
| CAD-F07 | UUID inválido, UUID existente, UUID válido inexistente | Completa | `limites-adicionais`, `cadastro-alunos` e `auditoria-cenarios-parciais` |
| CAD-F08 | Concluídos/total: **159**, 160, 161 em 160 | **Incompleta** | Há casos de 160 e de excesso; **159 não aparece como caso específico com asserção** |
| CAD-F09 | Matrícula inédita × duplicada (`P2002`) | Completa | `cadastro-alunos.test.ts` |
| TEN-F01 | Nota: −0,1, 0, 10, 10,1, **null, omitida** | **Incompleta** | Limites numéricos testados; **null/ausência no schema** não são exercitados explicitamente |
| TEN-F02 | Frequência: −0,1, 0, 100, 100,1, **null, omitida** | **Incompleta** | Limites numéricos testados; ausência testada na **persistência do serviço**, mas não `null`/ausência no **schema** |
| TEN-F03 | Período: 2026.1, 2026.2, 2026.3, **20261** | **Incompleta** | Válidos testados, `2026.3` testado; **`20261` não identificado** |
| TEN-F04 | Cinco situações válidas × inválida **DESISTENTE** | **Incompleta** | Cinco válidas testadas; o teste original rejeita `CANCELADA`, **não `DESISTENTE`** |
| TEN-F05 | Aluno existente × ausente | Completa | `registro-tentativas.test.ts` |
| TEN-F06 | Disciplina válida × inexistente × de outro curso | Completa | `registro-tentativas`, `servicos-adicionais` |
| TEN-F07 | Nota obrigatória em 3 situações × opcional em 2 | Completa | `registro-tentativas`, `servicos-adicionais` |
| TEN-F08 | Tentativa única × duplicada (`P2002`) | Completa | `registro-tentativas.test.ts` |

**Resultado da checagem de famílias:** 19 completas / 24 descritas = **79,17% de famílias totalmente demonstradas**. Esse índice é somente um **diagnóstico de completude das linhas das tabelas**, e **não** substitui os percentuais exigidos de cobertura de partições e valores-limite, cujos denominadores precisam de inventário individual.

## Cinco correções objetivas antes de fechar os indicadores

1. **CAD-F08:** testar `creditosConcluidos=159` para `creditosTotais=160`, verificando criação aceita.
2. **TEN-F01:** testar `nota: null` e nota omitida diretamente com `CreateTentativaSchema` (a validação do serviço é um nível separado).
3. **TEN-F02:** testar `frequencia: null` e frequência omitida diretamente no schema.
4. **TEN-F03:** testar o período inválido literal `20261` no schema.
5. **TEN-F04:** testar a situação inválida literal `DESISTENTE` no schema.

**Risco adicional fora dessas 24 famílias:** `CAD-CA02` estipula modalidade de ingresso com no máximo 90 caracteres, mas esse limite não consta da tabela de partições do cadastro e não foi localizado teste específico de 90/91 caracteres. Recomenda-se adicioná-lo à matriz e testar ambos os lados. Similarmente, `TEN-CA01` menciona o conjunto de situações, mas a matriz só especifica um exemplo inválido: devem ser preservadas as distinções entre requisitos e representantes.

## Cautelas para a documentação final

- A seção 8 da matriz informa **51/51 cenários E** e **19/19 critérios** por uma regra de classificação agregada; isso **não comprova** cobertura de todos os valores-limite listados nas tabelas.
- A v1 foi preservada e a v2 evoluiu para 109 testes, com execução informada pelo usuário; para computar porcentagens formais, a mesma taxonomia de partições e limites deve ser aplicada às duas versões.
- Não declarar 100% de partições/limites antes de acrescentar e executar os casos faltantes e reconciliar os denominadores do inventário.
- Evidências de comportamento do MVP não homologam regras do NEAP; EP-10 continua dependente dessa validação institucional.

## Atualização após os testes complementares — 15/11/2026

Após a auditoria das partições de equivalência e dos valores-limite,
foi criado o arquivo:

`graduate-back/tests/v2/fronteiras-pendentes.test.ts`

Foram acrescentados sete testes direcionados aos representantes
identificados como insuficientemente verificados.

### Resultado da execução

- Suíte: v2 complementada.
- Total de testes: 116.
- Testes aprovados: 116.
- Testes falhando: 0.
- Arquivos de teste executados: 8.
- Código de produção modificado: não.

### Observações

A execução confirmou que os sete testes complementares passaram.

A cobertura estrutural e a cobertura funcional são métricas
distintas. A aprovação dos testes não demonstra automaticamente
que todas as partições e todos os valores-limite definidos
na matriz estejam cobertos.

Permanece necessária a consolidação da contagem individual
das partições e fronteiras, incluindo a verificação dos
limites de 90 e 91 caracteres do campo modalidadeIngresso.