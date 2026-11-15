# Sprint 3 — Log de identificação de dívida técnica

**Data:** 15/11/2026. **Modelo:** GPT-6 (ChatGPT). **Método:** inspeção do código-fonte do projeto com apoio de LLM; nenhuma ferramenta de análise estática executada nesta rodada.

## Solicitação da equipe (contexto real)

> "pronto, vamos seguir para a divida tecnica e refatoração"

O pedido dá continuidade ao Graduate/NEAP e ao enunciado da **Sprint 3 (Parte 2) — Qualidade de Código, Dívida Técnica e Refatoração**, que pede aproximadamente oito itens confirmados, identificação por categoria, justificativa, três refatorações e execução dos testes antes/depois.

## Material analisado

- `graduate-back/src/common/triagem.ts`
- `graduate-back/src/common/validation.ts`
- `graduate-back/src/modules/alunos/alunos.service.ts`
- `graduate-front/src/modules/alunos/AlunoDetalhe.tsx`
- `graduate-front/src/modules/alunos/AlunosPage.tsx`

## Resultado sugerido pela LLM

Oito candidatos descritos em `docs/qualidade/divida-tecnica.md`, dos quais DT-01, DT-03 e DT-06 foram priorizados para refatoração. Os achados exigem confirmação da equipe olhando os trechos. Não se alegou uso de ESLint, Sonar, jscpd ou execução local da suíte nesta etapa.

## Revisão crítica / potenciais falsos positivos

- Reunir esquemas Zod em `validation.ts` não prova baixa coesão: sugestão descartada como dívida automática.
- Injeção de `PrismaService` não demonstra, sozinha, violação de DIP: sugestão descartada sem evidência adicional.
- Critérios de EP ainda não avaliados são limitação declarada do MVP, não problema a 'corrigir' por refatoração.

## Pendente

Confirmar/ajustar cada achado com revisão da equipe; registrar resultados de testes antes/depois; preencher tabela de status e reflexão manual versus LLM no relatório final.
