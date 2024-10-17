import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../auth.service';


@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }
    try {

      
      const { user , token : newToken } = await this.authService.verifyToken(token)
      request['user'] = user;
      request['token'] = newToken;
      
      const validRoles = this.reflector.get<string[]>('validRoles', context.getHandler());

      if (!validRoles) return true;
      if (validRoles.length === 0) return true;

      if ( !validRoles.includes( user.role ) ) {
        throw new ForbiddenException(
          `User ${ user.firstName } need a valid role: [${ validRoles }] to access this service`
        );
      }

    } catch (e){
      throw new UnauthorizedException(e);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}