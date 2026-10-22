import { Module } from '@nestjs/common';
import { PainelController } from './painel.controller';
import { HealthController } from './health.controller';
@Module({ controllers: [PainelController, HealthController] })
export class PainelModule {}
