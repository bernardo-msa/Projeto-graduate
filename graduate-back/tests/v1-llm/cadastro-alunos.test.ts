import { describe, expect, it, vi } from 'vitest';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateAlunoSchema } from '../../src/common/validation';
import { AlunosService } from '../../src/modules/alunos/alunos.service';
import type { PrismaService } from '../../src/database/prisma.service';

const CURSO_ID = '11111111-1111-4111-8111-111111111111';
const alunoValido = {
  matricula: 'MAT1234', nome: 'Maria Alves', email: 'maria@example.com',
  cursoId: CURSO_ID, periodoIngresso: '2026.1', modalidadeIngresso: 'Regular',
  cr: 8, creditosConcluidos: 40,
};

function servico() {
  const prisma = {
    curso: { findUnique: vi.fn() },
    aluno: { create: vi.fn() },
  };
  return { service: new AlunosService(prisma as unknown as PrismaService), prisma };
}

describe('schema de cadastro de alunos', () => {
  it('aceita dados válidos e remove espaços das extremidades do nome', () => {
    const resultado = CreateAlunoSchema.parse({ ...alunoValido, nome: '  Maria Alves  ' });
    expect(resultado.nome).toBe('Maria Alves');
  });

  it('rejeita matrícula muito curta', () => {
    expect(CreateAlunoSchema.safeParse({ ...alunoValido, matricula: 'ABC' }).success).toBe(false);
  });

  it('rejeita nome vazio', () => {
    expect(CreateAlunoSchema.safeParse({ ...alunoValido, nome: '' }).success).toBe(false);
  });

  it('rejeita CR superior a dez', () => {
    expect(CreateAlunoSchema.safeParse({ ...alunoValido, cr: 10.5 }).success).toBe(false);
  });

  it('rejeita créditos negativos', () => {
    expect(CreateAlunoSchema.safeParse({ ...alunoValido, creditosConcluidos: -1 }).success).toBe(false);
  });

  it('rejeita créditos fracionários', () => {
    expect(CreateAlunoSchema.safeParse({ ...alunoValido, creditosConcluidos: 1.5 }).success).toBe(false);
  });

  it('rejeita períodos de ingresso com semestre inválido', () => {
    expect(CreateAlunoSchema.safeParse({ ...alunoValido, periodoIngresso: '2026.3' }).success).toBe(false);
  });

  it('rejeita email malformado', () => {
    expect(CreateAlunoSchema.safeParse({ ...alunoValido, email: 'nao-e-email' }).success).toBe(false);
  });
});

describe('serviço de cadastro de alunos', () => {
  it('persiste um cadastro válido em curso existente', async () => {
    const { service, prisma } = servico();
    prisma.curso.findUnique.mockResolvedValue({ id: CURSO_ID, creditosTotais: 160 });
    prisma.aluno.create.mockResolvedValue({ id: 'aluno-1', ...alunoValido });
    const criado = await service.criar(alunoValido);
    expect(criado).toMatchObject({ id: 'aluno-1' });
    expect(prisma.aluno.create).toHaveBeenCalledOnce();
    expect(prisma.aluno.create).toHaveBeenCalledWith({ data: expect.objectContaining({ matricula: 'MAT1234' }) });
  });

  it('rejeita curso inexistente sem criar aluno', async () => {
    const { service, prisma } = servico();
    prisma.curso.findUnique.mockResolvedValue(null);
    await expect(service.criar(alunoValido)).rejects.toThrow(BadRequestException);
    expect(prisma.aluno.create).not.toHaveBeenCalled();
  });

  it('rejeita créditos concluídos acima do total do curso', async () => {
    const { service, prisma } = servico();
    prisma.curso.findUnique.mockResolvedValue({ id: CURSO_ID, creditosTotais: 30 });
    await expect(service.criar(alunoValido)).rejects.toThrow('Créditos concluídos ultrapassam os exigidos');
  });

  it('converte conflito P2002 do Prisma em ConflictException', async () => {
    const { service, prisma } = servico();
    prisma.curso.findUnique.mockResolvedValue({ id: CURSO_ID, creditosTotais: 160 });
    prisma.aluno.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint', { code: 'P2002', clientVersion: '6.16.0' }),
    );
    await expect(service.criar(alunoValido)).rejects.toThrow(ConflictException);
  });
});
