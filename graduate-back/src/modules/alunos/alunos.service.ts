import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { triagem } from '../../common/triagem';
import type { CreateAlunoDto, CreateAtendimentoDto, CreateTentativaDto } from '../../common/validation';

const incluirHistorico = { curso: true, tentativas: { include: { disciplina: true } } } as const;

function mapearDadosAluno(
  dto: CreateAlunoDto,
): Prisma.AlunoUncheckedCreateInput {
  return {
    matricula: dto.matricula,
    nome: dto.nome,
    email: dto.email || null,
    cursoId: dto.cursoId,
    periodoIngresso: dto.periodoIngresso,
    modalidadeIngresso: dto.modalidadeIngresso,
    cr: dto.cr,
    creditosConcluidos: dto.creditosConcluidos,
  };
}

@Injectable()
export class AlunosService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(busca?: string, cursoId?: string, situacao?: string) {
    const alunos = await this.prisma.aluno.findMany({
      where: {
        ...(cursoId ? { cursoId } : {}),
        ...(busca ? { OR: [
          { nome: { contains: busca, mode: 'insensitive' as const } },
          { matricula: { contains: busca, mode: 'insensitive' as const } },
          { email: { contains: busca, mode: 'insensitive' as const } },
        ] } : {}),
      },
      include: incluirHistorico,
      orderBy: { nome: 'asc' },
    });
    const resultado = alunos.map((aluno) => ({ ...aluno, triagem: triagem(aluno) }));
    return situacao ? resultado.filter((a) => a.triagem.situacao === situacao) : resultado;
  }

  async buscar(id: string) {
    const aluno = await this.prisma.aluno.findUnique({
      where: { id },
      include: {
        ...incluirHistorico,
        atendimentos: { orderBy: { criadoEm: 'desc' } },
      },
    });
    if (!aluno) throw new NotFoundException('Aluno não encontrado');
    return { ...aluno, triagem: triagem(aluno) };
  }

  async criar(dto: CreateAlunoDto) {
    const curso = await this.prisma.curso.findUnique({ where: { id: dto.cursoId } });
    if (!curso) throw new BadRequestException('Curso inexistente');
    if (dto.creditosConcluidos > curso.creditosTotais) {
      throw new BadRequestException('Créditos concluídos ultrapassam os exigidos');
    }
    try {
      return await this.prisma.aluno.create({
        data: mapearDadosAluno(dto),
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Matrícula já cadastrada');
      }
      throw error;
    }
  }

  async registrarTentativa(alunoId: string, dto: CreateTentativaDto) {
    const aluno = await this.prisma.aluno.findUnique({ where: { id: alunoId } });
    if (!aluno) throw new NotFoundException('Aluno não encontrado');
    const disciplina = await this.prisma.disciplina.findUnique({ where: { id: dto.disciplinaId } });
    if (!disciplina || disciplina.cursoId !== aluno.cursoId) {
      throw new BadRequestException('Disciplina não pertence ao curso do aluno');
    }
    if (dto.situacao !== 'CURSANDO' && dto.situacao !== 'TRANCADO' && dto.nota == null) {
      throw new BadRequestException('Informe a nota para disciplinas concluídas');
    }
    try {
      return await this.prisma.tentativa.create({ data: {
        alunoId, disciplinaId: dto.disciplinaId, periodo: dto.periodo,
        nota: dto.nota ?? null, frequencia: dto.frequencia ?? null, situacao: dto.situacao,
      } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Já existe registro dessa disciplina nesse período');
      }
      throw error;
    }
  }

  async registrarAtendimento(alunoId: string, dto: CreateAtendimentoDto, actor: string) {
    const aluno = await this.prisma.aluno.findUnique({ where: { id: alunoId }, select: { id: true } });
    if (!aluno) throw new NotFoundException('Aluno não encontrado');
    return this.prisma.atendimento.create({ data: {
      alunoId, tipo: dto.tipo, descricao: dto.descricao, registradoPor: actor,
    } });
  }

  // Importação simplificada: mesma validação do cadastro individual e rejeita duplicatas.
  // Transação = ou todos os alunos são salvos, ou nenhum. Sem acesso ao SIGAA.
  async importar(dtos: CreateAlunoDto[]) {
    const vistos = new Set<string>();
    const cursos = await this.prisma.curso.findMany();
    const porId = new Map(cursos.map((c) => [c.id, c]));
    for (const dto of dtos) {
      const curso = porId.get(dto.cursoId);
      if (!curso) throw new BadRequestException(`Curso inválido para matrícula ${dto.matricula}`);
      if (dto.creditosConcluidos > curso.creditosTotais) {
        throw new BadRequestException(`Créditos inválidos para ${dto.matricula}`);
      }
      if (vistos.has(dto.matricula)) throw new BadRequestException('Matrícula repetida no arquivo');
      vistos.add(dto.matricula);
    }
    try {
      await this.prisma.$transaction(
        dtos.map((dto) =>
          this.prisma.aluno.create({
            data: mapearDadosAluno(dto),
          }),
        ),
      );

      return { importados: dtos.length };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Arquivo contém matrícula já cadastrada; nada foi importado');
      }
      throw error;
    }
  }
}
