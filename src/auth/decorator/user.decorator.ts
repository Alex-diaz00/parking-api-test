import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const UserParam = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user){
        throw new InternalServerErrorException();
    }

    return request.user;
  },
);