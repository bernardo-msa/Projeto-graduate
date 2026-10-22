import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../../database/prisma.service';
import { triagem } from '../../common/triagem';

@ApiTags('Painel')
@Controller()
export class PainelController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('painel')
  async resumo() {
    const alunos = await this.prisma.aluno.findMany({
      include: { curso: true, tentativas: { include: { disciplina: true } } },
    });
    const tr = alunos.map(triagem);
    const total = alunos.length;
    const crMedio = total ? alunos.reduce((a, b) => a + b.cr, 0) / total : 0;
    return {
      totalAlunos: total,
      emAtencao: tr.filter((t) => t.situacao === 'ATENCAO').length,
      possivelEp: tr.filter((t) => t.situacao === 'POSSIVEL_EP').length,
      crMedio: Math.round(crMedio * 100) / 100,
      aviso: 'Dados fictícios de demonstração. Triagem não substitui o parecer do NEAP.',
    };
  }
}
