import { describe, expect, it, vi } from 'vitest';
import { triagem, type AlunoCompleto } from '../../src/common/triagem';
import { CreateAlunoSchema } from '../../src/common/validation';
import { AlunosService } from '../../src/modules/alunos/alunos.service';
import type { PrismaService } from '../../src/database/prisma.service';

const CURSO_ID = '11111111-1111-4111-8111-111111111111';
const DISC_ID = '22222222-2222-4222-8222-222222222222';

type Situacao = 'APROVADO' | 'CURSANDO' | 'TRANCADO' | 'REPROVADO_NOTA' | 'REPROVADO_FALTA';

function tentativa(id: string, periodo: string, situacao: Situacao, obrigatoria = true) {
  return {
    disciplinaId: id,
    periodo,
    situacao,
    disciplina: { codigo: id, nome: `Disciplina ${id}`, obrigatoria },
  };
}

function alunoCom(tentativas: ReturnType<typeof tentativa>[] = [], concluidos = 68, totais = 160): AlunoCompleto {
  return { curso: { creditosTotais: totais }, creditosConcluidos: concluidos, tentativas } as unknown as AlunoCompleto;
}

function criarServicoCadastro() {
  const prisma = {
    curso: { findUnique: vi.fn().mockResolvedValue({ id: CURSO_ID, creditosTotais: 160 }) },
    aluno: { create: vi.fn().mockResolvedValue({ id: 'aluno-1' }) },
  };
  return { service: new AlunosService(prisma as unknown as PrismaService), prisma };
}

function criarServicoTentativa() {
  const prisma = {
    aluno: { findUnique: vi.fn().mockResolvedValue({ id: 'aluno-1', cursoId: CURSO_ID }) },
    disciplina: { findUnique: vi.fn().mockResolvedValue({ id: DISC_ID, cursoId: CURSO_ID }) },
    tentativa: { create: vi.fn().mockResolvedValue({ id: 'tentativa-1' }) },
  };
  return { service: new AlunosService(prisma as unknown as PrismaService), prisma };
}

describe('Sprint 3 — auditoria dos nove cenários parcialmente cobertos', () => {
  it('EP-01: histórico literalmente vazio não apresenta reprovação nem evidência de repetência', () => {
    const r = triagem(alunoCom([]));
    expect(r.situacao).toBe('REGULAR');
    expect(r.totalReprovacoes).toBe(0);
    expect(r.reprovacoesPorDisciplina).toEqual([]);
    expect(r.evidencias.duasReprovacoesMesmaDisciplina).toBe(false);
  });

  it('EP-02: APROVADO, CURSANDO e TRANCADO não são considerados reprovações', () => {
    const r = triagem(alunoCom([
      tentativa('D1', '2025.1', 'APROVADO'),
      tentativa('D2', '2025.2', 'CURSANDO'),
      tentativa('D3', '2026.1', 'TRANCADO', false),
    ]));
    expect(r.situacao).toBe('REGULAR');
    expect(r.totalReprovacoes).toBe(0);
    expect(r.reprovacoesPorDisciplina).toEqual([]);
    expect(r.evidencias.duasReprovacoesMesmaDisciplina).toBe(false);
  });

  it('EP-04: duas reprovações por nota na mesma obrigatória acionam POSSIVEL_EP', () => {
    const r = triagem(alunoCom([
      tentativa('D1', '2025.1', 'REPROVADO_NOTA'),
      tentativa('D1', '2025.2', 'REPROVADO_NOTA'),
    ]));
    expect(r.situacao).toBe('POSSIVEL_EP');
    expect(r.totalReprovacoes).toBe(2);
    expect(r.evidencias.duasReprovacoesMesmaDisciplina).toBe(true);
    expect(r.reprovacoesPorDisciplina).toHaveLength(1);
    expect(r.reprovacoesPorDisciplina[0]).toMatchObject({ codigo: 'D1', obrigatoria: true, quantidadeReprovacoes: 2 });
  });

  it('EP-07: repetência em optativa permanece ATENCAO e detalha o grupo', () => {
    const r = triagem(alunoCom([
      tentativa('D3', '2025.1', 'REPROVADO_NOTA', false),
      tentativa('D3', '2025.2', 'REPROVADO_FALTA', false),
    ]));
    expect(r.situacao).toBe('ATENCAO');
    expect(r.totalReprovacoes).toBe(2);
    expect(r.evidencias.duasReprovacoesMesmaDisciplina).toBe(false);
    expect(r.reprovacoesPorDisciplina).toHaveLength(1);
    expect(r.reprovacoesPorDisciplina[0]).toMatchObject({ codigo: 'D3', obrigatoria: false, quantidadeReprovacoes: 2 });
  });

  it('EP-11: duas disciplinas formam grupos distintos com períodos e motivos preservados', () => {
    const r = triagem(alunoCom([
      tentativa('D1', '2024.1', 'REPROVADO_NOTA'),
      tentativa('D3', '2024.2', 'REPROVADO_FALTA', false),
      tentativa('D1', '2025.1', 'REPROVADO_NOTA'),
    ]));
    expect(r.totalReprovacoes).toBe(3);
    expect(r.reprovacoesPorDisciplina).toHaveLength(2);
    const obrigatoria = r.reprovacoesPorDisciplina.find((d) => d.codigo === 'D1');
    const optativa = r.reprovacoesPorDisciplina.find((d) => d.codigo === 'D3');
    expect(obrigatoria).toMatchObject({ nome: 'Disciplina D1', obrigatoria: true, quantidadeReprovacoes: 2 });
    expect(obrigatoria?.tentativas).toEqual([
      { periodo: '2024.1', situacao: 'REPROVADO_NOTA' },
      { periodo: '2025.1', situacao: 'REPROVADO_NOTA' },
    ]);
    expect(optativa).toMatchObject({ nome: 'Disciplina D3', obrigatoria: false, quantidadeReprovacoes: 1 });
    expect(optativa?.tentativas).toEqual([{ periodo: '2024.2', situacao: 'REPROVADO_FALTA' }]);
  });

  it('EP-15: 161 créditos concluídos de 160 deixam zero pendentes mas percentual 100,6%', () => {
    // Fixture inconsistente deliberado: triagem não valida créditos de entrada.
    const r = triagem(alunoCom([], 161, 160));
    expect(r.creditosPendentes).toBe(0);
    expect(r.percentualConcluido).toBe(100.6);
  });

  it('CAD-01: schema aceita cadastro completo e serviço persiste todos os campos mapeados', async () => {
    const dados = {
      matricula: 'MAT1234', nome: 'Maria Alves', email: 'maria@example.com',
      cursoId: CURSO_ID, periodoIngresso: '2026.1', modalidadeIngresso: 'Regular',
      cr: 6.4, creditosConcluidos: 68,
    };
    const dto = CreateAlunoSchema.parse(dados);
    const { service, prisma } = criarServicoCadastro();
    await expect(service.criar(dto)).resolves.toMatchObject({ id: 'aluno-1' });
    expect(prisma.curso.findUnique).toHaveBeenCalledWith({ where: { id: CURSO_ID } });
    expect(prisma.aluno.create).toHaveBeenCalledOnce();
    expect(prisma.aluno.create).toHaveBeenCalledWith({ data: dados });
  });

  it('CAD-07: trim é aplicado à matrícula e ao nome ANTES dos limites de comprimento', () => {
    const base = { matricula: 'ABCD', nome: 'Ana', cursoId: CURSO_ID, periodoIngresso: '2026.1' };
    const valido = CreateAlunoSchema.parse({ ...base, matricula: '  ABCD  ', nome: '  Ana  ' });
    expect(valido.matricula).toBe('ABCD');
    expect(valido.nome).toBe('Ana');
    expect(CreateAlunoSchema.safeParse({ ...base, matricula: '  ABC  ' }).success).toBe(false);
    expect(CreateAlunoSchema.safeParse({ ...base, matricula: `  ${'X'.repeat(31)}  ` }).success).toBe(false);
    expect(CreateAlunoSchema.safeParse({ ...base, nome: '  AB  ' }).success).toBe(false);
  });

  it('TEN-14: nota 7 e frequência omitida são persistidas como frequência null', async () => {
    const { service, prisma } = criarServicoTentativa();
    const dto = { disciplinaId: DISC_ID, periodo: '2026.1', situacao: 'APROVADO' as const, nota: 7 };
    await expect(service.registrarTentativa('aluno-1', dto)).resolves.toMatchObject({ id: 'tentativa-1' });
    expect(prisma.tentativa.create).toHaveBeenCalledWith({
      data: {
        alunoId: 'aluno-1', disciplinaId: DISC_ID, periodo: '2026.1',
        situacao: 'APROVADO', nota: 7, frequencia: null,
      },
    });
  });
});
