import { describe, it, expect } from 'vitest';
import { CreateAlunoSchema, CreateTentativaSchema } from '../../src/common/validation';

const CURSO = '11111111-1111-4111-8111-111111111111';
const DISC = '22222222-2222-4222-8222-222222222222';
const aluno = { matricula: 'ABCD', nome: 'Ana Silva', cursoId: CURSO, periodoIngresso: '2026.1', modalidadeIngresso: 'Regular', cr: 5, creditosConcluidos: 5 };
const tentativa = { disciplinaId: DISC, periodo: '2026.1', situacao: 'APROVADO' as const, nota: 7, frequencia: 75 };

describe('v2: fronteiras e partições adicionais de cadastro', () => {
  it.each([['ABC', false], ['ABCD', true], ['A'.repeat(30), true], ['A'.repeat(31), false]])('matrícula de %s caracteres: validade %s', (matricula, valido) => {
    expect(CreateAlunoSchema.safeParse({ ...aluno, matricula }).success).toBe(valido);
  });
  it.each([[2, false], [3, true], [150, true], [151, false]])('nome de %i caracteres: validade %s', (n, valido) => {
    expect(CreateAlunoSchema.safeParse({ ...aluno, nome: 'N'.repeat(n) }).success).toBe(valido);
  });
  it.each([[-0.1, false], [0, true], [10, true], [10.1, false]])('CR %s: validade %s', (cr, valido) => {
    expect(CreateAlunoSchema.safeParse({ ...aluno, cr }).success).toBe(valido);
  });
  it.each([[-1, false], [0, true], [1, true], [1.5, false]])('créditos %s: validade %s', (creditosConcluidos, valido) => {
    expect(CreateAlunoSchema.safeParse({ ...aluno, creditosConcluidos }).success).toBe(valido);
  });
  it('aplica valores padrão quando os opcionais são omitidos', () => {
    const { cr, creditosConcluidos, modalidadeIngresso } = CreateAlunoSchema.parse({ matricula: 'ABCD', nome: 'Ana', cursoId: CURSO, periodoIngresso: '2026.1' });
    expect({ cr, creditosConcluidos, modalidadeIngresso }).toEqual({ cr: 0, creditosConcluidos: 0, modalidadeIngresso: 'Não informada' });
  });
  it.each([['2026.1', true], ['2026.2', true], ['2026.3', false], ['26.1', false]])('período ingresso %s válido: %s', (periodoIngresso, valido) => {
    expect(CreateAlunoSchema.safeParse({ ...aluno, periodoIngresso }).success).toBe(valido);
  });
  it('rejeita cursoId inválido', () => {
    expect(CreateAlunoSchema.safeParse({ ...aluno, cursoId: 'invalido' }).success).toBe(false);
  });
  it.each([[undefined, true], ['', true], ['a@exemplo.com', true], ['invalido', false]])('email %s válido: %s', (email, valido) => {
    expect(CreateAlunoSchema.safeParse({ ...aluno, email }).success).toBe(valido);
  });
});

describe('v2: fronteiras e partições adicionais de tentativas', () => {
  it.each([[-0.1, false], [0, true], [10, true], [10.1, false]])('nota %s válida: %s', (nota, valido) => {
    expect(CreateTentativaSchema.safeParse({ ...tentativa, nota }).success).toBe(valido);
  });
  it.each([[-0.1, false], [0, true], [100, true], [100.1, false]])('frequência %s válida: %s', (frequencia, valido) => {
    expect(CreateTentativaSchema.safeParse({ ...tentativa, frequencia }).success).toBe(valido);
  });
  it.each(['APROVADO', 'REPROVADO_NOTA', 'REPROVADO_FALTA', 'CURSANDO', 'TRANCADO'])('aceita a situação %s', (situacao) => {
    expect(CreateTentativaSchema.safeParse({ ...tentativa, situacao }).success).toBe(true);
  });
  it('rejeita disciplinaId inválido', () => {
    expect(CreateTentativaSchema.safeParse({ ...tentativa, disciplinaId: 'xxx' }).success).toBe(false);
  });
  it.each(['2026.1', '2026.2'])('aceita período %s', (periodo) => {
    expect(CreateTentativaSchema.safeParse({ ...tentativa, periodo }).success).toBe(true);
  });
});
