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

### Revisão crítica apresentada e concordância humana registrada

As conclusões a seguir foram expostas à equipe como avaliação preliminar e um integrante manifestou concordância expressa. Para uma **validação independente de código**, ainda é recomendável abrir os trechos na versão analisada e registrar responsável e evidência; a concordância com a interpretação da LLM não deve ser apresentada como inspeção independente.

| ID | Avaliação aceita pelo integrante da equipe | Fundamentação da decisão | Registro |
|---|---|---|---|
| DT-01 | **Confirmado** | A função reunia identificação/agrupamento de reprovações, classificação e indicadores curriculares; a extração explicitou responsabilidades. A quantidade de operações, isoladamente, não prova violação de SRP. | Concordância registrada na conversa em 15/11/2026. |
| DT-02 | **Confirmado com ressalva — baixa prioridade** | O literal `2` representa um limiar de domínio; uma constante nomeada facilitaria a explicitação da regra, mas o impacto de manutenção é limitado. | Concordância registrada na conversa em 15/11/2026. |
| DT-03 | **Confirmado** | O mapeamento duplicado em `criar()` e `importar()` elevava o risco de divergência ao adicionar campos; `mapearDadosAluno()` centralizou a conversão. | Concordância registrada na conversa em 15/11/2026. |
| DT-04 | **Confirmado parcialmente — sem refatoração prioritária** | Há repetição do padrão de tratamento de `P2002`, mas mensagens e contextos de erro diferentes podem justificar blocos separados. Não foi demonstrado ganho líquido de uma abstração. | Concordância registrada na conversa em 15/11/2026. |
| DT-05 | **Confirmado com ressalva — melhoria condicional** | `importar()` reúne consulta, validações e transação, porém as etapas pertencem a um mesmo caso de uso; pluralidade de etapas não comprova violação de SRP. | Concordância registrada na conversa em 15/11/2026. |
| DT-06 | **Confirmado** | A apresentação da Análise EP estava acoplada a uma página extensa. A extração para `AlunoAnaliseEP.tsx` separou responsabilidades de apresentação, sem resolver toda a complexidade da página. | Concordância registrada na conversa em 15/11/2026. |
| DT-07 | **Confirmado parcialmente — sem refatoração prioritária** | Os manipuladores de formulários repetem padrões, mas representam fluxos diferentes; uma abstração poderia aumentar a complexidade. | Concordância registrada na conversa em 15/11/2026. |
| DT-08 | **Confirmado como risco — requer teste de caracterização** | O fallback `disciplinaId || disciplinasCurso[0]?.id` pode submeter a primeira disciplina quando não há escolha explícita, criando risco de desencontro entre interface e intenção do usuário. Não foi afirmado defeito reproduzido. | Concordância registrada na conversa em 15/11/2026. |

**Natureza da confirmação:** após receber a análise crítica individual apresentada pela LLM, um integrante da equipe declarou na conversa: **“chat, concordo com suas interpretações”**. Isso registra concordância humana com os argumentos e a priorização, **não comprova uma inspeção independente de todos os trechos no editor, nem validação pelos demais integrantes**. A equipe poderá complementar este registro com nomes e evidências de inspeção própria, se exigidos pela avaliação.

## 4. Revisão crítica: potenciais falsos positivos descartados

- Reunir esquemas Zod em `validation.ts` **não prova**, por si só, baixa coesão; não foi incluído como dívida automática.
- Injeção de `PrismaService` **não demonstra isoladamente** violação de DIP; sugestão descartada sem evidência adicional.
- Critérios de EP ainda não avaliados são limitação declarada do MVP, não problema a corrigir por refatoração.

A principal contribuição da LLM foi **apontar locais e categorias candidatos a inspeção**. A decisão de engenharia exige examinar consequências reais, risco de alteração e testes disponíveis. Por isso, três sugestões foram priorizadas e implementadas, enquanto cinco permaneceram para eventual tratamento futuro; isso não significa que os cinco achados tenham sido automaticamente validados pela equipe.

## 5. Evidências de testes, limitações e pendências

- **No momento das refatorações DT-01 e DT-03:** a suíte v2 então existente executou **95/95** testes; há registros de build do backend. Para DT-06, há registro de build do frontend e da posterior verificação visual da aba Análise EP em 15/11/2026.
- **Em auditoria posterior:** a suíte v2 ampliada executou **121/121** testes, segundo os resultados de terminal registrados; essa contagem **não** deve ser atribuída às execuções históricas imediatamente após as refatorações.
- Os testes de backend não constituem prova de integração real com banco de dados, Keycloak ou teste automatizado dos componentes React.
- **Situação metodológica:** a concordância de um integrante com as oito interpretações foi registrada na tabela acima. Ainda não há comprovação de inspeção independente, item a item, nem manifestação dos demais integrantes. Os commits demonstram as três intervenções, não a revisão autônoma de todos os diagnósticos.

**Artefatos correlatos:** `docs/qualidade/divida-tecnica-graduate.md`, `docs/qualidade/evidencias-refatoracao.md`, `docs/qualidade/graduate_sprint3_relatorio_refatoracao.pdf` e histórico Git dos commits `ef7f311`, `f834577` e `c4f0c6d`.
