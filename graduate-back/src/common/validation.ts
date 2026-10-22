import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateAlunoSchema = z.object({
  matricula: z.string().trim().min(4).max(30),
  nome: z.string().trim().min(3).max(150),
  email: z.union([z.email(), z.literal('')]).optional(),
  cursoId: z.uuid(),
  periodoIngresso: z.string().regex(/^\d{4}\.[12]$/),
  modalidadeIngresso: z.string().trim().max(90).default('Não informada'),
  cr: z.number().min(0).max(10).default(0),
  creditosConcluidos: z.number().int().min(0).default(0),
});
export class CreateAlunoDto extends createZodDto(CreateAlunoSchema) {}

export const CreateTentativaSchema = z.object({
  disciplinaId: z.uuid(),
  periodo: z.string().regex(/^\d{4}\.[12]$/),
  nota: z.number().min(0).max(10).nullable().optional(),
  frequencia: z.number().min(0).max(100).nullable().optional(),
  situacao: z.enum(['APROVADO','REPROVADO_NOTA','REPROVADO_FALTA','CURSANDO','TRANCADO']),
});
export class CreateTentativaDto extends createZodDto(CreateTentativaSchema) {}

export const CreateAtendimentoSchema = z.object({
  tipo: z.enum(['CONTATO','ORIENTACAO','ENCAMINHAMENTO','OUTRO']),
  descricao: z.string().trim().min(5).max(2000),
});
export class CreateAtendimentoDto extends createZodDto(CreateAtendimentoSchema) {}

export const ImportacaoSchema = z.object({
  alunos: z.array(CreateAlunoSchema).min(1).max(100),
});
export class ImportacaoDto extends createZodDto(ImportacaoSchema) {}
