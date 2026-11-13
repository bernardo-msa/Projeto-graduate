import type { Prisma } from '@prisma/client';

export type AlunoCompleto = Prisma.AlunoGetPayload<{
  include: { curso: true, tentativas: { include: { disciplina: true } } };
}>;

// ATENÇÃO: isto é uma TRIAGEM, não um parecer regulamentar nem decisão do NEAP.
// Apenas a repetência em componente obrigatório pode ser identificada com segurança
// a partir do recorte de dados já cadastrado; os outros critérios exigem histórico completo.
export function triagem(aluno: AlunoCompleto) {
  const reprovadas = aluno.tentativas.filter((t) =>
    t.situacao === 'REPROVADO_NOTA' || t.situacao === 'REPROVADO_FALTA',
  );
  const reprovacoesPorDisciplina = new Map<
    string,
    {
      codigo: string;
      nome: string;
      obrigatoria: boolean;
      quantidadeReprovacoes: number;
      tentativas: {
        periodo: string;
        situacao: string;
      }[];
    }
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

  const detalhesReprovacoes = [...reprovacoesPorDisciplina.values()];

  const repetencia = detalhesReprovacoes.some(
    (disciplina) =>
      disciplina.obrigatoria &&
      disciplina.quantidadeReprovacoes >= 2,
  );
  const situacao = repetencia ? 'POSSIVEL_EP'
    : reprovadas.length > 0 ? 'ATENCAO' : 'REGULAR';
    return {
    situacao,
    totalReprovacoes: reprovadas.length,

    creditosPendentes: Math.max(
      0,
      aluno.curso.creditosTotais - aluno.creditosConcluidos,
    ),

    reprovacoesPorDisciplina: detalhesReprovacoes,
    percentualConcluido: aluno.curso.creditosTotais > 0
      ? Math.round(aluno.creditosConcluidos / aluno.curso.creditosTotais * 1000) / 10
    : 0,
    evidencias: {
      duasReprovacoesMesmaDisciplina: repetencia,
      todasReprovadasUltimoSemestre: null,
      crBaixoDoisSemestres: null,
      prazoIntegralizacao: null,
    },
    aviso: 'Indicadores preliminares; conferir histórico integral e regulamento vigente com o NEAP.',
  };
}
