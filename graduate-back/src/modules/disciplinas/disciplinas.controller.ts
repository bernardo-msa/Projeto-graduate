import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service';

@ApiTags('Disciplinas')
@Controller('disciplinas')
export class DisciplinasController {
  constructor(private readonly prisma: PrismaService) {}
  @Get()
  async listar(@Query('cursoId') cursoId?: string) {
    const disciplinas = await this.prisma.disciplina.findMany({
      where: cursoId ? { cursoId } : undefined,
      include: { curso: { select: { nome: true } }, tentativas: true },
      orderBy: { nome: 'asc' },
    });
    return disciplinas.map(({ tentativas, ...disciplina }) => ({
      ...disciplina,
      totalTentativas: tentativas.length,
      aprovadas: tentativas.filter((t) => t.situacao === 'APROVADO').length,
      reprovadas: tentativas.filter((t) => t.situacao.startsWith('REPROVADO')).length,
    }));
  }
}
