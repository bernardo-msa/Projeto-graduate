import { describe, expect, it } from 'vitest';
import { CreateAlunoSchema } from '../../src/common/validation';

const modalidade = CreateAlunoSchema.shape.modalidadeIngresso;

describe('CAD-CA02 — Limites da modalidade de ingresso', () => {

  it('aceita exatamente 90 caracteres', () => {
    const resultado = modalidade.safeParse('A'.repeat(90));

    expect(resultado.success).toBe(true);

    if (resultado.success) {
      expect(resultado.data).toHaveLength(90);
    }
  });

  it('rejeita 91 caracteres', () => {
    const resultado = modalidade.safeParse('A'.repeat(91));

    expect(resultado.success).toBe(false);
  });

  it('remove espaços antes de verificar o limite', () => {
    const resultado = modalidade.safeParse(
      '  ' + 'A'.repeat(90) + '  '
    );

    expect(resultado.success).toBe(true);

    if (resultado.success) {
      expect(resultado.data).toBe('A'.repeat(90));
    }
  });

});