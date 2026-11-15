# Sprint 3 — Evidências das refatorações

## DT-01 — Extract Function

**Arquivo:** `graduate-back/src/common/triagem.ts`

**Problema:** concentração de responsabilidades na função de triagem acadêmica.

**Solução:** extração das operações de identificação e agrupamento de reprovações, classificação acadêmica e cálculo de indicadores curriculares.

**Commit:** `ef7f311`

**Validação:**
- Antes: 95 testes aprovados.
- Depois: 95 testes aprovados.
- Build do backend aprovado.
- Interface pública da função preservada.

**Resultado:** maior separação de responsabilidades e legibilidade.

## DT-03 — Extract Function

**Arquivo:** `graduate-back/src/modules/alunos/alunos.service.ts`

**Problema:** duplicação do mapeamento dos dados de alunos nos métodos de cadastro individual e importação.

**Solução:** criação da função `mapearDadosAluno()`, reutilizada pelos dois métodos.

**Commit:** `f834577`

**Validação:**
- Antes: 95 testes aprovados.
- Depois: 95 testes aprovados.
- Build do backend aprovado.
- `git diff --check` sem erros.

**Resultado:** redução de duplicação e centralização da transformação dos dados.

## DT-06 — Extract Component

**Arquivos:**
- `graduate-front/src/modules/alunos/AlunoDetalhe.tsx`
- `graduate-front/src/modules/alunos/AlunoAnaliseEP.tsx`

**Problema:** concentração da apresentação de diferentes funcionalidades em um único componente React.

**Solução:** extração da interface de Análise EP para um componente independente que recebe os dados de triagem por props.

**Commit:** `c4f0c6d`

**Validação:**
- Build TypeScript aprovado.
- Build Vite aprovado.
- `git diff --check` sem erros.
- Verificação visual da interface: pendente de confirmação no registro.

**Resultado:** redução do tamanho do componente principal e melhor separação das responsabilidades de apresentação.

## Limitações

Os 95 testes automatizados verificam principalmente o backend. Eles não constituem evidência direta de preservação da interface React.

As verificações demonstram ausência de regressões detectadas pelos testes existentes, mas não garantem equivalência absoluta de comportamento.