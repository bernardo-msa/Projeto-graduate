# Sprint 3 — Relatório de dívida técnica do Graduate

**Escopo analisado:** `graduate-back/src/common/triagem.ts`, `graduate-back/src/common/validation.ts`, `graduate-back/src/modules/alunos/alunos.service.ts`, `graduate-front/src/modules/alunos/AlunoDetalhe.tsx` e `graduate-front/src/modules/alunos/AlunosPage.tsx`.

**Método:** inspeção do código-fonte com apoio de GPT-6; os achados abaixo devem ser conferidos e aceitos pela equipe antes de serem considerados o diagnóstico definitivo. Não houve execução de analisador estático nesta etapa. **Status inicial:** Aberto. As referências a métodos e trechos são mais estáveis que números de linha.

| ID | Local | Problema confirmado no código | Categoria | Consequência concreta | Identificação | Prioridade | Status |
|---|---|---|---|---|---|---|---|
| DT-01 | `common/triagem.ts`, `triagem()` | A mesma função filtra e agrupa reprovações, decide a classificação EP, calcula indicadores de créditos e monta o DTO de resposta. | Coesão; SRP (candidato); Long Method | Uma alteração na regra de classificação ou no indicador curricular exige editar e revisar uma única rotina com diferentes razões para mudar. | Inspeção de código + LLM, a validar | Alta | Aberto |
| DT-02 | `common/triagem.ts`, condição `quantidadeReprovacoes >= 2` | O limite acadêmico `2` está embutido na comparação, sem nome explícito da regra. | Magic Number; integridade conceitual | Dificulta localizar e explicar a origem do limiar; uma mudança de regra depende de procurar a constante literal. | Inspeção de código + LLM, a validar | Baixa | Aberto |
| DT-03 | `modules/alunos/alunos.service.ts`, `criar()` e `importar()` | O mapeamento `CreateAlunoDto -> data` para Prisma repete os mesmos campos em dois lugares. | Duplicated Code; coesão da transformação | Acrescentar campo de cadastro exige atualizar dois mapeamentos; omissão em um fluxo pode produzir inconsistência. | Inspeção de código + LLM, a validar | Alta | Aberto |
| DT-04 | `modules/alunos/alunos.service.ts`, `criar()`, `registrarTentativa()` e `importar()` | Os blocos de captura de `PrismaClientKnownRequestError`/`P2002` e conversão em `ConflictException` se repetem, com mensagens próprias. | Duplicated Code; consistência de tratamento de erro | Ajustar a estratégia de tratamento exige mexer em três blocos; aumenta risco de comportamentos de erro inconsistentes. | Inspeção de código + LLM, a validar | Média | Aberto |
| DT-05 | `modules/alunos/alunos.service.ts`, `importar()` | O método consulta cursos, valida dados, verifica duplicatas, monta operações, abre transação e converte erros. | Long Method; coesão | Alterar uma etapa da importação exige navegar por responsabilidades distintas na mesma rotina; difícil testar cada etapa isoladamente. | Inspeção de código + LLM, a validar | Média | Aberto |
| DT-06 | `graduate-front/src/modules/alunos/AlunoDetalhe.tsx`, `AlunoDetalhe()` | Um único componente de ~213 linhas renderiza quatro abas, dois formulários e fluxo de persistência. | Large Component; baixa coesão; SRP (candidato) | Alterações visuais na aba EP ou no histórico podem causar regressões em outras abas e dificultam testes isolados. | Inspeção de código + LLM, a validar | Alta | Aberto |
| DT-07 | `AlunoDetalhe.tsx`, `salvarTentativa()` e `salvarAtendimento()` | Ambos os manipuladores repetem `preventDefault`, limpeza de feedback, controle `salvando`, `try/catch/finally` e `reload`. | Duplicated Code; complexidade de manutenção | Mudanças na política de feedback/erro devem ser replicadas; há risco de divergências futuras. | Inspeção de código + LLM, a validar | Média | Aberto |
| DT-08 | `AlunoDetalhe.tsx`, estados e `salvarTentativa()` | O componente armazena numerosos estados de campos; `disciplinaId || disciplinasCurso[0]?.id` ainda possui fallback implícito, apesar de o `<select>` exigir escolha. | Estado disperso; acoplamento entre UI e regra de submissão; inconsistência conceitual | A validação da interface e a regra de submissão podem divergir; difícil rastrear a escolha efetivamente enviada. **Não alterar essa regra durante uma refatoração sem teste de caracterização.** | Inspeção de código + LLM, a validar | Média | Aberto |

## Seleção proposta de três refatorações

**DT-01 — Extract Function:** extrair para funções nomeadas o agrupamento de reprovações e o cálculo dos indicadores de créditos, mantendo `triagem()` como ponto de composição. Prioridade: código de domínio com cobertura de testes já existente.

**DT-03 — Extract Function:** centralizar a conversão de dados de aluno para persistência em uma função compartilhada por `criar()` e `importar()`. Prioridade: eliminar duplicação em dois caminhos de escrita; validar com suíte v2.

**DT-06 — Extract Component:** extrair a aba de análise EP de `AlunoDetalhe.tsx` em componente separado, mantendo a mesma interface/markup e props. Prioridade: desmembrar componente longo; como a suíte v2 é de backend, exigir `npm run build` e verificação manual da aba ou novo teste de UI antes da alteração.

## Linha de base exigida

Antes de qualquer refatoração, em `graduate-back/`: `npx vitest run tests/v2`; resultado de referência observado anteriormente: **95 testes aprovados**. Em `graduate-front/`: `npm run build` para registrar a linha de base da interface; **ainda não verificado nesta etapa**. Depois de cada commit, executar de novo os testes aplicáveis e anotar resultados em `docs/qualidade/relatorio-refatoracao.md`.

## Achados descartados / cautelas

- `common/validation.ts` contém esquemas de validação relacionados; reunir esquemas em um arquivo **não constitui por si só** violação de SRP. Não incluído como dívida sem consequência verificável.
- Dependência do `AlunosService` em `PrismaService` não basta, isoladamente, para afirmar violação de DIP, especialmente porque o NestJS já injeta a dependência. Não incluído sem evidência de dificuldade concreta.
- `triagem()` declarar critérios não avaliados como `null` é limitação funcional assumida do MVP, não necessariamente dívida de refatoração; alterar isso modificaria comportamento.

## Requisitos de registro

Cada item refatorado exige commit separado com ID (`DT-01`, `DT-03`, `DT-06`), descrição antes/depois e testes antes/depois. A revisão humana deve registrar quais sugestões da LLM foram aceitas ou descartadas.
