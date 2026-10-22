import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import type { Request } from 'express';
import { PUBLIC_ROUTE } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';

// Segurança de verdade: valida assinatura, emissor, audiência e expiração do JWT.
@Injectable()
export class KeycloakGuard implements CanActivate {
  private readonly issuer = process.env.KEYCLOAK_ISSUER!;
  private readonly audience = process.env.KEYCLOAK_AUDIENCE!;
  private readonly jwks = createRemoteJWKSet(new URL(process.env.KEYCLOAK_JWKS_URL ?? `${this.issuer}/protocol/openid-connect/certs`));

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const publicRoute = this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE, [
      context.getHandler(), context.getClass(),
    ]);
    if (publicRoute) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;
    if (!authorization?.startsWith('Bearer ')) throw new UnauthorizedException('Token ausente');

    try {
      const token = authorization.slice('Bearer '.length);
      const result = await jwtVerify(token, this.jwks, {
        issuer: this.issuer, audience: this.audience,
        algorithms: ['RS256'],
      });
      const payload = result.payload as typeof result.payload & {
        realm_access?: { roles?: string[] };
        preferred_username?: string;
      };
      const roles = payload.realm_access?.roles ?? [];
      const allowed = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
        context.getHandler(), context.getClass(),
      ]) ?? ['NEAP', 'ADMIN'];
      if (!allowed.some((role) => roles.includes(role))) {
        throw new ForbiddenException('Perfil sem permissão no NEAP');
      }
      // O identificador para auditoria vem do token validado, nunca do formulário.
      (request as Request & { actor?: string }).actor = payload.preferred_username ?? payload.sub;
      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }
}
