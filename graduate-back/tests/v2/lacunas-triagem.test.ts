import { describe, expect, it } from 'vitest';
import { triagem, type AlunoCompleto } from '../../src/common/triagem';

type Situacao = 'APROVADO' | 'REPROVADO_NOTA' | 'REPROVADO_FALTA';

function tentativa(periodo: string, situacao: Situacao) {
  return {
    disciplinaId: 'disciplina-mat',
    periodo,
    situacao,
    disciplina: {
      codigo: 'MAT001',
      nome: 'Cálculo I',
      obrigatoria: true,
    },
  };
}

function alunoCom(
  tentativas: ReturnType<typeof tentativa>[] = [],
  creditosConcluidos = 68,
  creditosTotais = 160,
): AlunoCompleto {
  // A função pura acessa apenas esses campos do aluno e de suas relações.
  return {
    curso: { creditosTotais },
    creditosConcluidos,
    tentativas,
  } as unknown as AlunoCompleto;
}

describe('Sprint 3 — lacunas de rastreabilidade da triagem (v2)', () => {
  it('EP-05 / CA03: três reprovações na mesma obrigatória continuam indicando POSSIVEL_EP', () => {
    const resultado = triagem(alunoCom([
      tentativa('2024.1', 'REPROVADO_NOTA'),
      tentativa('2024.2', 'REPROVADO_FALTA'),
      tentativa('2025.1', 'REPROVADO_NOTA'),
    ]));

    expect(resultado.situacao).toBe('POSSIVEL_EP');
    expect(resultado.totalReprovacoes).toBe(3);
    expect(resultado.evidencias.duasReprovacoesMesmaDisciplina).toBe(true);
    expect(resultado.reprovacoesPorDisciplina).toHaveLength(1);
    expect(resultado.reprovacoesPorDisciplina[0]).toMatchObject({
      codigo: 'MAT001', obrigatoria: true, quantidadeReprovacoes: 3,
    });
  });

  it('EP-10 / CA03, CA04: aprovação posterior não apaga as duas reprovações históricas', () => {
    // Oráculo do comportamento atual, NÃO parecer regulamentar do NEAP.
    const resultado = triagem(alunoCom([
      tentativa('2024.1', 'REPROVADO_NOTA'),
      tentativa('2024.2', 'REPROVADO_FALTA'),
      tentativa('2025.1', 'APROVADO'),
    ]));

    expect(resultado.situacao).toBe('POSSIVEL_EP');
    expect(resultado.totalReprovacoes).toBe(2);
    expect(resultado.reprovacoesPorDisciplina).toHaveLength(1);
    expect(resultado.reprovacoesPorDisciplina[0].quantidadeReprovacoes).toBe(2);
    expect(resultado.reprovacoesPorDisciplina[0].tentativas).toEqual([
      { periodo: '2024.1', situacao: 'REPROVADO_NOTA' },
      { periodo: '2024.2', situacao: 'REPROVADO_FALTA' },
    ]);
  });

  it('EP-13 / CA06: 0 de 160 créditos significa 160 pendentes e 0%', () => {
    const resultado = triagem(alunoCom([], 0, 160));
    expect(resultado.creditosPendentes).toBe(160);
    expect(resultado.percentualConcluido).toBe(0);
  });

  it('EP-14 / CA06: 160 de 160 créditos significa 0 pendentes e 100%', () => {
    const resultado = triagem(alunoCom([], 160, 160));
    expect(resultado.creditosPendentes).toBe(0);
    expect(resultado.percentualConcluido).toBe(100);
  });

  it('EP-17 / CA06: 1 de 160 créditos arredonda 0,625% para 0,6%', () => {
    const resultado = triagem(alunoCom([], 1, 160));
    expect(resultado.creditosPendentes).toBe(159);
    expect(resultado.percentualConcluido).toBe(0.6);
  });
});
