# Sprint 3 — Log de identificação e revisão de dívida técnica

**Data da identificação:** 15/11/2026. **Modelo de apoio:** GPT-6 (ChatGPT). **Método:** inspeção do código-fonte com auxílio de LLM; não há registro de execução de analisador estático nesta rodada.

## 1. Solicitação da equipe (registro literal disponível)

> "pronto, vamos seguir para a divida tecnica e refatoração"

O pedido deu continuidade ao Graduate/NEAP e à **Sprint 3 (Parte 2) — Qualidade de Código, Dívida Técnica e Refatoração**, que solicita aproximadamente oito problemas fundamentados, uma avaliação de sua pertinência, três refatorações e verificações antes/depois.

## 2. Material analisado

- `graduate-back/src/common/triagem.ts`
- `graduate-back/src/common/validation.ts`
- `graduate-back/src/modules/alunos/alunos.service.ts`
- `graduate-front/src/modules/alunos/AlunoDetalhe.tsx`
- `graduate-front/src/modules/alunos/AlunosPage.tsx`

## 3. Resultado sugerido pela LLM e desfecho técnico

A LLM auxiliou a identificar oito candidatos, descritos em `docs/qualidade/divida-tecnica-graduate.md`. Três foram selecionados para refatoração e cinco permaneceram no registro. A implementação de uma refatoração e a revisão humana de todos os diagnósticos são fatos distintos: **os commits comprovam alterações no código, mas não substituem a confirmação individual dos achados pela equipe**.

| ID | Evidência que a equipe deve conferir no código | Decisão técnica documentada | Evidência de intervenção | Confirmação humana individual |
|---|---|---|---|---|
| DT-01 | `triagem.ts`: filtragem, agrupamento, classificação e indicadores estavam na mesma função. | Refatorada por *Extract Function*. | `ef7f311`; suíte v2 histórica: 95 testes aprovados; build backend. | **A registrar pela equipe.** |
| DT-02 | `triagem.ts`: literal `2` na condição de repetência. | Mantida como dívida de baixa prioridade. | Registro de dívida técnica; sem refatoração. | **A registrar pela equipe.** |
| DT-03 | `alunos.service.ts`: mesmos campos mapeados em `criar()` e `importar()`. | Refatorada com `mapearDadosAluno()`. | `f834577`; suíte v2 histórica: 95 testes aprovados; build backend. | **A registrar pela equipe.** |
| DT-04 | `alunos.service.ts`: blocos semelhantes de tratamento de erro Prisma `P2002`. | Mantida como dívida de prioridade média. | Registro de dívida técnica; sem refatoração. | **A registrar pela equipe.** |
| DT-05 | `alunos.service.ts`: `importar()` reúne consulta, validações, transação e tratamento de erros. | Mantida como dívida de prioridade média. | Registro de dívida técnica; sem refatoração. | **A registrar pela equipe.** |
| DT-06 | `AlunoDetalhe.tsx`: apresentação da Análise EP integrada a componente com outras abas. | Refatorada por *Extract Component*, criando `AlunoAnaliseEP.tsx`. | `c4f0c6d`; build frontend e inspeção visual registrados em `evidencias-refatoracao.md` (15/11/2026). | **A registrar pela equipe.** |
| DT-07 | `AlunoDetalhe.tsx`: fluxos semelhantes de feedback, salvamento e tratamento de erros dos formulários. | Mantida como dívida de prioridade média. | Registro de dívida técnica; sem refatoração. | **A registrar pela equipe.** |
| DT-08 | `AlunoDetalhe.tsx`: estados dispersos e fallback `disciplinaId || disciplinasCurso[0]?.id`. | Mantida como dívida de prioridade média; qualquer mudança exige caracterização prévia. | Registro de dívida técnica; sem refatoração. | **A registrar pela equipe.** |

### Procedimento de confirmação humana

Para cada linha, um integrante deve abrir o trecho indicado, conferir se o problema e sua consequência descrita realmente existiam na versão analisada e registrar a decisão como **confirmado**, **confirmado com ressalva** ou **descartado**. Se houver correção de diagnóstico, atualizar também o relatório de dívida técnica. Registrar nome ou identificação do revisor, data e, quando útil, o commit ou trecho examinado. **Não preencher retroativamente sem ter feito a verificação.**

| ID | Decisão humana (confirmado / ressalva / descartado) | Justificativa ou correção | Revisor e data |
|---|---|---|---|
| DT-01 | A preencher | A preencher | A preencher |
| DT-02 | A preencher | A preencher | A preencher |
| DT-03 | A preencher | A preencher | A preencher |
| DT-04 | A preencher | A preencher | A preencher |
| DT-05 | A preencher | A preencher | A preencher |
| DT-06 | A preencher | A preencher | A preencher |
| DT-07 | A preencher | A preencher | A preencher |
| DT-08 | A preencher | A preencher | A preencher |

## 4. Revisão crítica: potenciais falsos positivos descartados

- Reunir esquemas Zod em `validation.ts` **não prova**, por si só, baixa coesão; não foi incluído como dívida automática.
- Injeção de `PrismaService` **não demonstra isoladamente** violação de DIP; sugestão descartada sem evidência adicional.
- Critérios de EP ainda não avaliados são limitação declarada do MVP, não problema a corrigir por refatoração.

A principal contribuição da LLM foi **apontar locais e categorias candidatos a inspeção**. A decisão de engenharia exige examinar consequências reais, risco de alteração e testes disponíveis. Por isso, três sugestões foram priorizadas e implementadas, enquanto cinco permaneceram para eventual tratamento futuro; isso não significa que os cinco achados tenham sido automaticamente validados pela equipe.

## 5. Evidências de testes, limitações e pendências

- **No momento das refatorações DT-01 e DT-03:** a suíte v2 então existente executou **95/95** testes; há registros de build do backend. Para DT-06, há registro de build do frontend e da posterior verificação visual da aba Análise EP em 15/11/2026.
- **Em auditoria posterior:** a suíte v2 ampliada executou **121/121** testes, segundo os resultados de terminal registrados; essa contagem **não** deve ser atribuída às execuções históricas imediatamente após as refatorações.
- Os testes de backend não constituem prova de integração real com banco de dados, Keycloak ou teste automatizado dos componentes React.
- **Pendente para encerramento metodológico:** realizar e registrar a revisão humana individual na tabela acima. A conclusão de três refatorações não autoriza declarar os oito achados humanamente confirmados.

**Artefatos correlatos:** `docs/qualidade/divida-tecnica-graduate.md`, `docs/qualidade/evidencias-refatoracao.md`, `docs/qualidade/graduate_sprint3_relatorio_refatoracao.pdf` e histórico Git dos commits `ef7f311`, `f834577` e `c4f0c6d`.
