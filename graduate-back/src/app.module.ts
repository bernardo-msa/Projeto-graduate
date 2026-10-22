import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ZodValidationPipe } from 'nestjs-zod';
import { KeycloakGuard } from './auth/keycloak.guard';
import { PrismaModule } from './database/prisma.module';
import { AlunosModule } from './modules/alunos/alunos.module';
import { CursosModule } from './modules/cursos/cursos.module';
import { DisciplinasModule } from './modules/disciplinas/disciplinas.module';
import { PainelModule } from './modules/painel/painel.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: (env) => {
      for (const key of ['DATABASE_URL','KEYCLOAK_ISSUER','KEYCLOAK_AUDIENCE','FRONTEND_ORIGIN']) {
        if (!env[key]) throw new Error(`Variável obrigatória ausente: ${key}`);
      }
      return env;
    } }),
    PrismaModule, AlunosModule, CursosModule, DisciplinasModule, PainelModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: KeycloakGuard },
    { provide: APP_PIPE, useClass: ZodValidationPipe },
  ],
})
export class AppModule {}
