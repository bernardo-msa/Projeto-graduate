import { BadRequestException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { AlunosService } from '../../src/modules/alunos/alunos.service';
import type { PrismaService } from '../../src/database/prisma.service';

const CURSO = '11111111-1111-4111-8111-111111111111';

function servico() {
  const prisma = {
    curso: { findUnique: vi.fn().mockResolvedValue({ id: CURSO, creditosTotais: 160 }) },
    aluno: { create: vi.fn().mockResolvedValue({ id: 'aluno-criado' }) },
  };
  return { service: new AlunosService(prisma as unknown as PrismaService), prisma };
}

function cadastro(creditosConcluidos: number) {
  return {
    matricula: 'MAT160', nome: 'Aluno Teste', email: null,
    cursoId: CURSO, periodoIngresso: '2026.1',
    modalidadeIngresso: 'Regular', cr: 6, creditosConcluidos,
  };
}

describe('CAD-F08 — fronteiras de créditos concluídos em curso com 160', () => {
  it('aceita 160 de 160 créditos e persiste o limite superior', async () => {
    const { service, prisma } = servico();
    await expect(service.criar(cadastro(160))).resolves.toMatchObject({ id: 'aluno-criado' });
    expect(prisma.aluno.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ creditosConcluidos: 160, cursoId: CURSO }),
    });
  });

  it('rejeita 161 de 160 créditos e não tenta persistir', async () => {
    const { service, prisma } = servico();
    await expect(service.criar(cadastro(161))).rejects.toThrow(BadRequestException);
    expect(prisma.aluno.create).not.toHaveBeenCalled();
  });
});
