import { describe, expect, it, vi } from 'vitest';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateTentativaSchema } from '../../src/common/validation';
import { AlunosService } from '../../src/modules/alunos/alunos.service';
import type { PrismaService } from '../../src/database/prisma.service';

const DISCIPLINA_ID = '22222222-2222-4222-8222-222222222222';
const tentativaValida = {
  disciplinaId: DISCIPLINA_ID,
  periodo: '2026.1', nota: 7.5, frequencia: 80, situacao: 'APROVADO' as const,
};

function servico() {
  const prisma = {
    aluno: { findUnique: vi.fn() },
    disciplina: { findUnique: vi.fn() },
    tentativa: { create: vi.fn() },
  };
  prisma.aluno.findUnique.mockResolvedValue({ id: 'aluno-1', cursoId: 'curso-1' });
  prisma.disciplina.findUnique.mockResolvedValue({ id: DISCIPLINA_ID, cursoId: 'curso-1' });
  return { service: new AlunosService(prisma as unknown as PrismaService), prisma };
}

describe('schema de registro de tentativas', () => {
  it('aceita tentativa válida', () => {
    expect(CreateTentativaSchema.safeParse(tentativaValida).success).toBe(true);
  });

  it('rejeita período inválido', () => {
    expect(CreateTentativaSchema.safeParse({ ...tentativaValida, periodo: '2026.3' }).success).toBe(false);
  });

  it('rejeita nota fora da faixa', () => {
    expect(CreateTentativaSchema.safeParse({ ...tentativaValida, nota: -0.1 }).success).toBe(false);
    expect(CreateTentativaSchema.safeParse({ ...tentativaValida, nota: 10.1 }).success).toBe(false);
  });

  it('rejeita frequência fora da faixa', () => {
    expect(CreateTentativaSchema.safeParse({ ...tentativaValida, frequencia: -1 }).success).toBe(false);
    expect(CreateTentativaSchema.safeParse({ ...tentativaValida, frequencia: 101 }).success).toBe(false);
  });

  it('rejeita situação acadêmica desconhecida', () => {
    expect(CreateTentativaSchema.safeParse({ ...tentativaValida, situacao: 'CANCELADA' }).success).toBe(false);
  });
});

describe('serviço de registro de tentativas', () => {
  it('registra uma tentativa válida', async () => {
    const { service, prisma } = servico();
    prisma.tentativa.create.mockResolvedValue({ id: 'tentativa-1' });
    await expect(service.registrarTentativa('aluno-1', tentativaValida)).resolves.toMatchObject({ id: 'tentativa-1' });
    expect(prisma.tentativa.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ alunoId: 'aluno-1', nota: 7.5 }),
    });
  });

  it('rejeita aluno inexistente', async () => {
    const { service, prisma } = servico();
    prisma.aluno.findUnique.mockResolvedValue(null);
    await expect(service.registrarTentativa('inexistente', tentativaValida)).rejects.toThrow(NotFoundException);
    expect(prisma.tentativa.create).not.toHaveBeenCalled();
  });

  it('rejeita disciplina de outro curso', async () => {
    const { service, prisma } = servico();
    prisma.disciplina.findUnique.mockResolvedValue({ cursoId: 'outro-curso' });
    await expect(service.registrarTentativa('aluno-1', tentativaValida)).rejects.toThrow(BadRequestException);
    expect(prisma.tentativa.create).not.toHaveBeenCalled();
  });

  it('exige nota quando a situação é APROVADO', async () => {
    const { service } = servico();
    await expect(service.registrarTentativa('aluno-1', {
      ...tentativaValida, nota: null,
    })).rejects.toThrow('Informe a nota para disciplinas concluídas');
  });

  it('permite CURSANDO sem nota', async () => {
    const { service, prisma } = servico();
    prisma.tentativa.create.mockResolvedValue({ id: 'tentativa-2' });
    await expect(service.registrarTentativa('aluno-1', {
      ...tentativaValida, situacao: 'CURSANDO', nota: null,
    })).resolves.toMatchObject({ id: 'tentativa-2' });
  });

  it('converte duplicidade P2002 em ConflictException', async () => {
    const { service, prisma } = servico();
    prisma.tentativa.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint', { code: 'P2002', clientVersion: '6.16.0' }),
    );
    await expect(service.registrarTentativa('aluno-1', tentativaValida)).rejects.toThrow(ConflictException);
  });
});
