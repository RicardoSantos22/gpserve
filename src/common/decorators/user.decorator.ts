import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ValidatedUser } from '../../auth/strategies/jwt.strategy';

export const AuthenticatedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as ValidatedUser;
  },
);