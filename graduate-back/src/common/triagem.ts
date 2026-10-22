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
  const contagem = new Map<string, number>();
  for (const tentativa of reprovadas) {
    if (tentativa.disciplina.obrigatoria) {
      const id = tentativa.disciplinaId;
      contagem.set(id, (contagem.get(id) ?? 0) + 1);
    }
  }
  const repetencia = [...contagem.values()].some((qtd) => qtd >= 2);
  const situacao = repetencia ? 'POSSIVEL_EP'
    : reprovadas.length > 0 ? 'ATENCAO' : 'REGULAR';
  return {
    situacao,
    percentualConcluido: aluno.curso.creditosTotais > 0
      ? Math.round(aluno.creditosConcluidos / aluno.curso.creditosTotais * 1000) / 10 : 0,
    evidencias: {
      duasReprovacoesMesmaDisciplina: repetencia,
      todasReprovadasUltimoSemestre: null,
      crBaixoDoisSemestres: null,
      prazoIntegralizacao: null,
    },
    aviso: 'Indicadores preliminares; conferir histórico integral e regulamento vigente com o NEAP.',
  };
}
