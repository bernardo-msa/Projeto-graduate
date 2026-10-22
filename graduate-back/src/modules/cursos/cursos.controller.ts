import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service';

@ApiTags('Cursos')
@Controller('cursos')
export class CursosController {
  constructor(private readonly prisma: PrismaService) {}
  @Get()
  async listar() {
    const cursos = await this.prisma.curso.findMany({
      include: { _count: { select: { alunos: true, disciplinas: true } } },
      orderBy: { nome: 'asc' },
    });
    return cursos;
  }
}
