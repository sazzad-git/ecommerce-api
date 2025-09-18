import {
  CanActivate,
  ExecutionContext,
  Injectable,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// @Injectable()
// export class AuthorizeGuard implements CanActivate {
//   constructor(private reflactor: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const allowedRoles = this.reflactor.get<string[]>(
//       'allowedRoles',
//       context.getHandler(),
//     );
//     const request = context.switchToHttp().getRequest();
//     const result = request?.currentUser?.roles
//       .map((role: string) => allowedRoles.includes(role))
//       .find((val: boolean) => val === true);

//     if (result) return true;
//     throw new UnauthorizedException('sorry you are not allowed');
//   }
// }

export const AuthorizeGuard = (allowedRoles: string[]) => {
  class RolesGaurdMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const result = request?.currentUser?.roles
        .map((role: string) => allowedRoles.includes(role))
        .find((val: boolean) => val === true);

      if (result) return true;
      throw new UnauthorizedException('sorry you are not allowed');
    }
  }
  const guard = mixin(RolesGaurdMixin);
  return guard;
};
