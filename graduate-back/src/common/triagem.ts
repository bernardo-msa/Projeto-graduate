import type { Prisma } from '@prisma/client';

export type AlunoCompleto = Prisma.AlunoGetPayload<{
  include: {
    curso: true;
    tentativas: {
      include: { disciplina: true };
    };
  };
}>;

type TentativaAluno = AlunoCompleto['tentativas'][number];

interface ReprovacaoPorDisciplina {
  codigo: string;
  nome: string;
  obrigatoria: boolean;
  quantidadeReprovacoes: number;
  tentativas: {
    periodo: string;
    situacao: string;
  }[];
}

// Identifica as tentativas que resultaram em reprovação.
function obterReprovacoes(
  tentativas: TentativaAluno[],
): TentativaAluno[] {
  return tentativas.filter(
    (tentativa) =>
      tentativa.situacao === 'REPROVADO_NOTA' ||
      tentativa.situacao === 'REPROVADO_FALTA',
  );
}

// Agrupa as reprovações por disciplina.
function agruparReprovacoes(
  reprovadas: TentativaAluno[],
): ReprovacaoPorDisciplina[] {
  const reprovacoesPorDisciplina = new Map<
    string,
    ReprovacaoPorDisciplina
  >();

  for (const tentativa of reprovadas) {
    const disciplina = tentativa.disciplina;
    const id = tentativa.disciplinaId;

    if (!reprovacoesPorDisciplina.has(id)) {
      reprovacoesPorDisciplina.set(id, {
        codigo: disciplina.codigo,
        nome: disciplina.nome,
        obrigatoria: disciplina.obrigatoria,
        quantidadeReprovacoes: 0,
        tentativas: [],
      });
    }

    const registro = reprovacoesPorDisciplina.get(id)!;

    registro.quantidadeReprovacoes++;

    registro.tentativas.push({
      periodo: tentativa.periodo,
      situacao: tentativa.situacao,
    });
  }

  return [...reprovacoesPorDisciplina.values()];
}

// Verifica se existe repetência em disciplina obrigatória.
function possuiRepetenciaObrigatoria(
  reprovacoes: ReprovacaoPorDisciplina[],
): boolean {
  return reprovacoes.some(
    (disciplina) =>
      disciplina.obrigatoria &&
      disciplina.quantidadeReprovacoes >= 2,
  );
}

// Classifica a situação acadêmica preliminar.
function classificarSituacao(
  repetencia: boolean,
  totalReprovacoes: number,
): 'REGULAR' | 'ATENCAO' | 'POSSIVEL_EP' {
  if (repetencia) {
    return 'POSSIVEL_EP';
  }

  if (totalReprovacoes > 0) {
    return 'ATENCAO';
  }

  return 'REGULAR';
}

// Calcula os créditos que faltam para integralização.
function calcularCreditosPendentes(
  creditosTotais: number,
  creditosConcluidos: number,
): number {
  return Math.max(
    0,
    creditosTotais - creditosConcluidos,
  );
}

// Calcula o percentual de integralização curricular.
function calcularPercentualConcluido(
  creditosTotais: number,
  creditosConcluidos: number,
): number {
  if (creditosTotais <= 0) {
    return 0;
  }

  return (
    Math.round(
      (creditosConcluidos / creditosTotais) * 1000,
    ) / 10
  );
}

// ATENÇÃO: isto é uma TRIAGEM, não um parecer regulamentar
// nem uma decisão do NEAP.
//
// Apenas a repetência em componente obrigatório pode ser
// identificada com segurança a partir dos dados cadastrados.
//
// Os demais critérios exigem histórico acadêmico completo.

export function triagem(aluno: AlunoCompleto) {
  const reprovadas = obterReprovacoes(aluno.tentativas);

  const detalhesReprovacoes =
    agruparReprovacoes(reprovadas);

  const repetencia =
    possuiRepetenciaObrigatoria(detalhesReprovacoes);

  const situacao = classificarSituacao(
    repetencia,
    reprovadas.length,
  );

  const creditosPendentes = calcularCreditosPendentes(
    aluno.curso.creditosTotais,
    aluno.creditosConcluidos,
  );

  const percentualConcluido = calcularPercentualConcluido(
    aluno.curso.creditosTotais,
    aluno.creditosConcluidos,
  );

  return {
    situacao,
    totalReprovacoes: reprovadas.length,
    creditosPendentes,
    reprovacoesPorDisciplina: detalhesReprovacoes,
    percentualConcluido,
    evidencias: {
      duasReprovacoesMesmaDisciplina: repetencia,
      todasReprovadasUltimoSemestre: null,
      crBaixoDoisSemestres: null,
      prazoIntegralizacao: null,
    },
    aviso:
      'Indicadores preliminares; conferir histórico integral e regulamento vigente com o NEAP.',
  };
}