import { describe, expect, it } from 'vitest';
import { triagem, type AlunoCompleto } from '../../src/common/triagem';

type TentativaMock = {
  disciplinaId: string;
  periodo: string;
  situacao: 'APROVADO' | 'REPROVADO_NOTA' | 'REPROVADO_FALTA' | 'CURSANDO' | 'TRANCADO';
  disciplina: { codigo: string; nome: string; obrigatoria: boolean };
};

function alunoCom(tentativas: TentativaMock[] = [], concluidos = 68, totais = 160): AlunoCompleto {
  // Apenas os campos acessados pela função pura de triagem são relevantes neste teste.
  return {
    curso: { creditosTotais: totais },
    creditosConcluidos: concluidos,
    tentativas,
  } as unknown as AlunoCompleto;
}

function tentativa(id: string, periodo: string, situacao: TentativaMock['situacao'], obrigatoria = true): TentativaMock {
  return {
    disciplinaId: id,
    periodo,
    situacao,
    disciplina: { codigo: id, nome: `Disciplina ${id}`, obrigatoria },
  };
}

describe('triagem acadêmica', () => {
  it('classifica aluno sem reprovações como REGULAR', () => {
    const resultado = triagem(alunoCom([tentativa('MAT', '2025.1', 'APROVADO')]));
    expect(resultado.situacao).toBe('REGULAR');
    expect(resultado.totalReprovacoes).toBe(0);
    expect(resultado.reprovacoesPorDisciplina).toEqual([]);
  });

  it('classifica uma reprovação como ATENCAO', () => {
    const resultado = triagem(alunoCom([tentativa('MAT', '2025.1', 'REPROVADO_NOTA')]));
    expect(resultado.situacao).toBe('ATENCAO');
    expect(resultado.totalReprovacoes).toBe(1);
  });

  it('identifica repetência em disciplina obrigatória', () => {
    const resultado = triagem(alunoCom([
      tentativa('MAT', '2025.1', 'REPROVADO_NOTA'),
      tentativa('MAT', '2025.2', 'REPROVADO_FALTA'),
    ]));
    expect(resultado.situacao).toBe('POSSIVEL_EP');
    expect(resultado.evidencias.duasReprovacoesMesmaDisciplina).toBe(true);
    expect(resultado.reprovacoesPorDisciplina[0]).toMatchObject({
      codigo: 'MAT', obrigatoria: true, quantidadeReprovacoes: 2,
    });
    expect(resultado.reprovacoesPorDisciplina[0].tentativas).toEqual([
      { periodo: '2025.1', situacao: 'REPROVADO_NOTA' },
      { periodo: '2025.2', situacao: 'REPROVADO_FALTA' },
    ]);
  });

  it('não confunde duas disciplinas distintas com repetência', () => {
    const resultado = triagem(alunoCom([
      tentativa('MAT', '2025.1', 'REPROVADO_NOTA'),
      tentativa('FIS', '2025.2', 'REPROVADO_NOTA'),
    ]));
    expect(resultado.situacao).toBe('ATENCAO');
    expect(resultado.reprovacoesPorDisciplina).toHaveLength(2);
  });

  it('não sinaliza POSSIVEL_EP por repetência apenas em optativa', () => {
    const resultado = triagem(alunoCom([
      tentativa('OPT', '2025.1', 'REPROVADO_FALTA', false),
      tentativa('OPT', '2025.2', 'REPROVADO_NOTA', false),
    ]));
    expect(resultado.situacao).toBe('ATENCAO');
  });

  it('ignora tentativas aprovadas e em andamento na contagem de reprovações', () => {
    const resultado = triagem(alunoCom([
      tentativa('MAT', '2025.1', 'REPROVADO_NOTA'),
      tentativa('MAT', '2025.2', 'APROVADO'),
      tentativa('FIS', '2026.1', 'CURSANDO'),
    ]));
    expect(resultado.totalReprovacoes).toBe(1);
    expect(resultado.reprovacoesPorDisciplina).toHaveLength(1);
  });

  it('calcula percentagem de integralização e créditos pendentes', () => {
    const resultado = triagem(alunoCom([], 68, 160));
    expect(resultado.percentualConcluido).toBe(42.5);
    expect(resultado.creditosPendentes).toBe(92);
  });

  it('não divide por zero quando o curso tem zero créditos', () => {
    const resultado = triagem(alunoCom([], 0, 0));
    expect(resultado.percentualConcluido).toBe(0);
    expect(resultado.creditosPendentes).toBe(0);
  });

  it('não retorna créditos pendentes negativos', () => {
    const resultado = triagem(alunoCom([], 170, 160));
    expect(resultado.creditosPendentes).toBe(0);
  });

  it('não apresenta como avaliados os três critérios não implementados', () => {
    const resultado = triagem(alunoCom());
    expect(resultado.evidencias.todasReprovadasUltimoSemestre).toBeNull();
    expect(resultado.evidencias.crBaixoDoisSemestres).toBeNull();
    expect(resultado.evidencias.prazoIntegralizacao).toBeNull();
    expect(resultado.aviso).toContain('preliminares');
  });
});
