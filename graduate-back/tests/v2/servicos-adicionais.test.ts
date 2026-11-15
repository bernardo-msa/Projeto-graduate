import { describe, it, expect, vi } from 'vitest';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { AlunosService } from '../../src/modules/alunos/alunos.service';
import type { PrismaService } from '../../src/database/prisma.service';

const C = '11111111-1111-4111-8111-111111111111';
const D = '22222222-2222-4222-8222-222222222222';
const dto = { matricula: 'ABCD', nome: 'Ana Silva', cursoId: C, periodoIngresso: '2026.1', modalidadeIngresso: 'Regular', cr: 7, creditosConcluidos: 12 };
const tentativa = { disciplinaId: D, periodo: '2026.1', nota: 5, frequencia: 90, situacao: 'REPROVADO_NOTA' as const };
const unique = () => new Prisma.PrismaClientKnownRequestError('Unique constraint', { code: 'P2002', clientVersion: '6.16.0' });
function make() {
  const p = {
    curso: { findUnique: vi.fn(), findMany: vi.fn() },
    aluno: { findUnique: vi.fn(), findMany: vi.fn(), create: vi.fn() },
    disciplina: { findUnique: vi.fn() },
    tentativa: { create: vi.fn() },
    atendimento: { create: vi.fn() },
    $transaction: vi.fn(),
  };
  return { s: new AlunosService(p as unknown as PrismaService), p };
}
function fixture(id: string, tentativas: any[] = []) {
  return { id, nome: id, cursoId: C, curso: { creditosTotais: 160 }, creditosConcluidos: 12, tentativas };
}

describe('v2: cadastro e tentativas - ramos de persistência', () => {
  it('cadastra aluno com exatamente os créditos exigidos e email vazio convertido em null', async () => {
    const { s, p } = make();
    p.curso.findUnique.mockResolvedValue({ id: C, creditosTotais: 12 });
    p.aluno.create.mockResolvedValue({ id: 'a1' });
    await expect(s.criar({ ...dto, email: '' })).resolves.toEqual({ id: 'a1' });
    expect(p.aluno.create).toHaveBeenCalledWith({ data: expect.objectContaining({ email: null, creditosConcluidos: 12 }) });
  });
  it('repropaga erro inesperado do Prisma no cadastro', async () => {
    const { s, p } = make();
    const erro = new Error('banco indisponível');
    p.curso.findUnique.mockResolvedValue({ id: C, creditosTotais: 160 });
    p.aluno.create.mockRejectedValue(erro);
    await expect(s.criar(dto)).rejects.toBe(erro);
  });
  it('rejeita disciplina inexistente', async () => {
    const { s, p } = make();
    p.aluno.findUnique.mockResolvedValue({ id: 'a1', cursoId: C });
    p.disciplina.findUnique.mockResolvedValue(null);
    await expect(s.registrarTentativa('a1', tentativa)).rejects.toThrow(BadRequestException);
    expect(p.tentativa.create).not.toHaveBeenCalled();
  });
  it.each(['REPROVADO_NOTA', 'REPROVADO_FALTA'])('exige nota em %s', async (situacao) => {
    const { s, p } = make();
    p.aluno.findUnique.mockResolvedValue({ id: 'a1', cursoId: C });
    p.disciplina.findUnique.mockResolvedValue({ id: D, cursoId: C });
    await expect(s.registrarTentativa('a1', { ...tentativa, situacao: situacao as typeof tentativa.situacao, nota: null })).rejects.toThrow('Informe a nota');
    expect(p.tentativa.create).not.toHaveBeenCalled();
  });
  it('aceita TRANCADO sem nota e frequência', async () => {
    const { s, p } = make();
    p.aluno.findUnique.mockResolvedValue({ id: 'a1', cursoId: C });
    p.disciplina.findUnique.mockResolvedValue({ id: D, cursoId: C });
    p.tentativa.create.mockResolvedValue({ id: 't1' });
    await s.registrarTentativa('a1', { ...tentativa, situacao: 'TRANCADO', nota: null, frequencia: null });
    expect(p.tentativa.create).toHaveBeenCalledWith({ data: expect.objectContaining({ nota: null, frequencia: null }) });
  });
  it('aceita nota zero sem inferir situação automaticamente', async () => {
    const { s, p } = make();
    p.aluno.findUnique.mockResolvedValue({ id: 'a1', cursoId: C });
    p.disciplina.findUnique.mockResolvedValue({ id: D, cursoId: C });
    p.tentativa.create.mockResolvedValue({ id: 't1' });
    await s.registrarTentativa('a1', { ...tentativa, nota: 0, frequencia: 0, situacao: 'APROVADO' });
    expect(p.tentativa.create).toHaveBeenCalledWith({ data: expect.objectContaining({ nota: 0, frequencia: 0, situacao: 'APROVADO' }) });
  });
  it('repropaga erro desconhecido do Prisma em tentativa', async () => {
    const { s, p } = make();
    const erro = new Error('falha');
    p.aluno.findUnique.mockResolvedValue({ id: 'a1', cursoId: C });
    p.disciplina.findUnique.mockResolvedValue({ id: D, cursoId: C });
    p.tentativa.create.mockRejectedValue(erro);
    await expect(s.registrarTentativa('a1', tentativa)).rejects.toBe(erro);
  });
});

describe('v2: listagem e consulta', () => {
  it('lista alunos ordenados com triagem e filtros de busca/curso', async () => {
    const { s, p } = make();
    p.aluno.findMany.mockResolvedValue([fixture('Ana'), fixture('Bia')]);
    const result = await s.listar('Ana', C);
    expect(result).toHaveLength(2);
    expect(result[0].triagem.situacao).toBe('REGULAR');
    expect(p.aluno.findMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { nome: 'asc' }, where: expect.objectContaining({ cursoId: C, OR: expect.any(Array) }) }));
  });
  it('filtra a situação acadêmica retornada', async () => {
    const { s, p } = make();
    p.aluno.findMany.mockResolvedValue([fixture('Ana'), fixture('Bia', [{ disciplinaId: D, situacao: 'REPROVADO_NOTA', periodo: '2026.1', disciplina: { codigo: 'MAT', nome: 'Mat', obrigatoria: true } }])]);
    const result = await s.listar(undefined, undefined, 'ATENCAO');
    expect(result.map(a => a.id)).toEqual(['Bia']);
  });
  it('lança NotFound ao buscar aluno ausente', async () => {
    const { s, p } = make();
    p.aluno.findUnique.mockResolvedValue(null);
    await expect(s.buscar('ausente')).rejects.toThrow(NotFoundException);
  });
  it('retorna aluno, atendimentos e triagem na consulta', async () => {
    const { s, p } = make();
    p.aluno.findUnique.mockResolvedValue({ ...fixture('Ana'), atendimentos: [] });
    const result = await s.buscar('Ana');
    expect(result.triagem.creditosPendentes).toBe(148);
    expect(result.atendimentos).toEqual([]);
  });
});

describe('v2: acompanhamento e importação em lote', () => {
  it('não registra atendimento para aluno inexistente', async () => {
    const { s, p } = make();
    p.aluno.findUnique.mockResolvedValue(null);
    await expect(s.registrarAtendimento('a1', { tipo: 'CONTATO', descricao: 'Descrição válida' }, 'neap')).rejects.toThrow(NotFoundException);
  });
  it('registra atendimento com autor informado', async () => {
    const { s, p } = make();
    p.aluno.findUnique.mockResolvedValue({ id: 'a1' });
    p.atendimento.create.mockResolvedValue({ id: 'at1' });
    await s.registrarAtendimento('a1', { tipo: 'CONTATO', descricao: 'Descrição válida' }, 'usuario-neap');
    expect(p.atendimento.create).toHaveBeenCalledWith({ data: expect.objectContaining({ registradoPor: 'usuario-neap', alunoId: 'a1' }) });
  });
  it('importa lote válido dentro de uma transação', async () => {
    const { s, p } = make();
    p.curso.findMany.mockResolvedValue([{ id: C, creditosTotais: 160 }]);
    p.aluno.create.mockReturnValue({ prismaPromise: true });
    p.$transaction.mockResolvedValue([]);
    await expect(s.importar([dto, { ...dto, matricula: 'EFGH' }])).resolves.toEqual({ importados: 2 });
    expect(p.$transaction).toHaveBeenCalledOnce();
    expect(p.$transaction.mock.calls[0][0]).toHaveLength(2);
  });
  it('rejeita curso inválido antes da transação', async () => {
    const { s, p } = make();
    p.curso.findMany.mockResolvedValue([]);
    await expect(s.importar([dto])).rejects.toThrow(BadRequestException);
    expect(p.$transaction).not.toHaveBeenCalled();
  });
  it('rejeita créditos acima do curso antes da transação', async () => {
    const { s, p } = make();
    p.curso.findMany.mockResolvedValue([{ id: C, creditosTotais: 10 }]);
    await expect(s.importar([dto])).rejects.toThrow('Créditos inválidos');
    expect(p.$transaction).not.toHaveBeenCalled();
  });
  it('rejeita matrícula repetida no arquivo antes da transação', async () => {
    const { s, p } = make();
    p.curso.findMany.mockResolvedValue([{ id: C, creditosTotais: 160 }]);
    await expect(s.importar([dto, dto])).rejects.toThrow('Matrícula repetida');
    expect(p.$transaction).not.toHaveBeenCalled();
  });
  it('converte P2002 na importação em ConflictException', async () => {
    const { s, p } = make();
    p.curso.findMany.mockResolvedValue([{ id: C, creditosTotais: 160 }]);
    p.aluno.create.mockReturnValue({ prismaPromise: true });
    p.$transaction.mockRejectedValue(unique());
    await expect(s.importar([dto])).rejects.toThrow(ConflictException);
  });
  it('repropaga erro inesperado da transação', async () => {
    const { s, p } = make();
    const error = new Error('banco fora');
    p.curso.findMany.mockResolvedValue([{ id: C, creditosTotais: 160 }]);
    p.aluno.create.mockReturnValue({ prismaPromise: true });
    p.$transaction.mockRejectedValue(error);
    await expect(s.importar([dto])).rejects.toBe(error);
  });
});
