import { Module } from '@nestjs/common';
import { DisciplinasController } from './disciplinas.controller';
@Module({ controllers: [DisciplinasController] })
export class DisciplinasModule {}
