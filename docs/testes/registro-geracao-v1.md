# Registro da geração da suíte v1 — Graduate

Data: 2026-11-15

## Objetivo e contexto

Geração inicial de testes automatizados para o backend do MVP Graduate, usando Vitest. Solicitou-se testar a triagem acadêmica, o cadastro de alunos e o registro de tentativas. A matriz de rastreabilidade estava previamente registrada no Git, mas **não foi utilizada como entrada na geração da suíte v1**.

## Entrada efetivamente utilizada

- `graduate-back/src/common/triagem.ts`
- `graduate-back/src/common/validation.ts`
- `graduate-back/src/modules/alunos/alunos.service.ts`
- `graduate-back/prisma/schema.prisma` (disponível para inspeção)
- `graduate-back/package.json` (disponível para inspeção)

## Instrução do usuário

> vamos fazer a geração da suite v1, não fiz nenhuma arquivo ainda

O pedido se insere no fluxo estabelecido de gerar três arquivos de testes, preservar uma v1 gerada com auxílio de LLM e comparar posteriormente os resultados com a matriz da equipe. A geração foi feita pelo ChatGPT GPT-6, a partir do código do ZIP enviado na conversa.

## Arquivos produzidos

- `graduate-back/tests/v1-llm/triagem.test.ts`
- `graduate-back/tests/v1-llm/cadastro-alunos.test.ts`
- `graduate-back/tests/v1-llm/registro-tentativas.test.ts`

## Estado da evidência

Esta é a **primeira geração entregue**, sem execução dos testes no ambiente local do estudante e sem correções pós-execução. Eventuais falhas devem ser registradas antes de editar arquivos desta versão. O relatório de execução e a análise de lacunas ainda não foram produzidos.

Este registro resume a interação, mas não substitui a preservação da conversa original, caso a atividade exija transcrição integral de prompts e respostas.
