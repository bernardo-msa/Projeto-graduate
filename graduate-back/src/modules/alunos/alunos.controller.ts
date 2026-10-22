import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateAlunoDto, CreateAtendimentoDto, CreateTentativaDto, ImportacaoDto } from '../../common/validation';
import { AlunosService } from './alunos.service';

@ApiTags('Alunos')
@ApiBearerAuth()
@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunos: AlunosService) {}

  @Get()
  listar(@Query('busca') busca?: string, @Query('cursoId') cursoId?: string,
    @Query('situacao') situacao?: string) {
    return this.alunos.listar(busca, cursoId, situacao);
  }

  @Post()
  criar(@Body() dto: CreateAlunoDto) { return this.alunos.criar(dto); }

  @Post('importacao')
  importar(@Body() dto: ImportacaoDto) { return this.alunos.importar(dto.alunos); }

  @Get(':id')
  buscar(@Param('id', ParseUUIDPipe) id: string) { return this.alunos.buscar(id); }

  @Post(':id/tentativas')
  tentativa(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateTentativaDto) {
    return this.alunos.registrarTentativa(id, dto);
  }

  @Post(':id/atendimentos')
  atendimento(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateAtendimentoDto,
    @Req() request: Request & { actor?: string }) {
    return this.alunos.registrarAtendimento(id, dto, request.actor ?? 'desconhecido');
  }
}
