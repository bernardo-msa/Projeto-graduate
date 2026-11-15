# Sprint 3 — Análise de lacunas da suíte v1

## Evidência observada

Em 15/11/2026, a execução local registrada pelo grupo apresentou **33 testes aprovados em 3 arquivos**. Cobertura global configurada: instruções 40,17%, branches 45,78%, funções 28,57%, linhas 44,55%. `triagem.ts` e `validation.ts` foram reportados com 100% nas quatro métricas; `alunos.service.ts` teve 46% de linhas. A configuração considera também arquivos de backend fora das três histórias; **não equivale à cobertura integral do produto**.

## Confronto qualitativo com a matriz

- **US01 / EP:** v1 verifica classificação regular, atenção, possível EP, mistura de motivos, disciplinas distintas/optativas, contagem e percentuais. Não isola todas as fronteiras da matriz (por exemplo 3 reprovações em obrigatória, todos os créditos concluídos, arredondamento com 1 crédito, aprovação após duas reprovações).
- **US02 / CAD:** v1 verifica formato curto da matrícula, nome vazio, CR acima do máximo, créditos inválidos, semestre, email, cadastro válido, curso inexistente, crédito acima do limite e P2002. Faltam limites exatos de 4/30 caracteres, nome 3/150, CR 0/10, valores padrão, UUID inválido e conversão de email vazio.
- **US03 / TEN:** v1 verifica validações gerais de faixa e período, enum inválido, cadastro válido, aluno inexistente, disciplina de outro curso, nota em aprovado, cursando e P2002. Faltam disciplina inexistente, `TRANCADO`, nota obrigatória nas duas modalidades de reprovação, fronteiras numéricas exatas e frequência omitida.
- **`AlunosService`:** cobertura parcial porque listagem, busca, atendimentos e importação não receberam testes na v1. A v2 também incluirá testes complementares dessas operações; **eles extrapolam as três histórias selecionadas**, logo não devem ser contabilizados como cumprimento automático dos critérios US01–US03.

## Estratégia para v2

A pasta `tests/v2` contém **cópias integrais dos testes v1** mais arquivos adicionais de fronteiras e de serviço. O resultado da v1 não deve ser alterado. Executar as versões isoladamente, no mesmo escopo de cobertura, e registrar resultados observados; não presumir que novos testes passem nem que aumentem todas as métricas.

```bash
cd graduate-back
npx vitest run tests/v1-llm --coverage --coverage.reporter=text
npx vitest run tests/v2 --coverage --coverage.reporter=text
```

Os números da v2 deverão ser preenchidos **após execução**. Para evitar cobertura dupla, não usar `npm test` para comparar v1 e v2, pois ele executa ambas.

## Limites

Testes com Prisma simulado são unitários, não garantem comportamento em PostgreSQL, integração com Keycloak, interfaces React, nem importação real via arquivo. O mock de `$transaction` não comprova atomicidade no banco. A verificação dos critérios regulamentares de EP continua dependendo do NEAP.
