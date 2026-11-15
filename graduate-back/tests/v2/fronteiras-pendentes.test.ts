import { describe, expect, it, vi } from 'vitest';
import { CreateTentativaSchema } from '../../src/common/validation';
import { AlunosService } from '../../src/modules/alunos/alunos.service';
import type { PrismaService } from '../../src/database/prisma.service';

const CURSO = '11111111-1111-4111-8111-111111111111';
const DISCIPLINA = '22222222-2222-4222-8222-222222222222';
const baseTentativa = {
  disciplinaId: DISCIPLINA,
  periodo: '2026.1',
  situacao: 'CURSANDO' as const,
  nota: 7,
  frequencia: 80,
};

function alunoValido(creditosConcluidos: number) {
  return {
    matricula: 'MAT159',
    nome: 'Aluno Teste',
    email: null,
    cursoId: CURSO,
    periodoIngresso: '2026.1',
    modalidadeIngresso: 'Regular',
    cr: 6,
    creditosConcluidos,
  };
}

describe('Auditoria final — representantes pendentes da matriz', () => {
  it('CAD-F08: aceita 159 créditos concluídos num curso com 160', async () => {
    const prisma = {
      curso: { findUnique: vi.fn().mockResolvedValue({ id: CURSO, creditosTotais: 160 }) },
      aluno: { create: vi.fn().mockResolvedValue({ id: 'novo-aluno' }) },
    };
    const service = new AlunosService(prisma as unknown as PrismaService);
    await expect(service.criar(alunoValido(159))).resolves.toMatchObject({ id: 'novo-aluno' });
    expect(prisma.aluno.create).toHaveBeenCalledWith({ data: expect.objectContaining({ creditosConcluidos: 159 }) });
  });

  it('TEN-F01: schema aceita nota null', () => {
    expect(CreateTentativaSchema.safeParse({ ...baseTentativa, nota: null }).success).toBe(true);
  });

  it('TEN-F01: schema aceita nota omitida', () => {
    const { nota: _nota, ...semNota } = baseTentativa;
    expect(CreateTentativaSchema.safeParse(semNota).success).toBe(true);
  });

  it('TEN-F02: schema aceita frequência null', () => {
    expect(CreateTentativaSchema.safeParse({ ...baseTentativa, frequencia: null }).success).toBe(true);
  });

  it('TEN-F02: schema aceita frequência omitida', () => {
    const { frequencia: _frequencia, ...semFrequencia } = baseTentativa;
    expect(CreateTentativaSchema.safeParse(semFrequencia).success).toBe(true);
  });

  it('TEN-F03: schema rejeita período sem separador (20261)', () => {
    expect(CreateTentativaSchema.safeParse({ ...baseTentativa, periodo: '20261' }).success).toBe(false);
  });

  it('TEN-F04: schema rejeita situação desconhecida DESISTENTE', () => {
    expect(CreateTentativaSchema.safeParse({ ...baseTentativa, situacao: 'DESISTENTE' }).success).toBe(false);
  });
});
