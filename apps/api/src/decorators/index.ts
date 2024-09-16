import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { UserWithoutPassword } from '~libs/entities';

export const GetUser = createParamDecorator(
  (_, ctx: ExecutionContext): UserWithoutPassword => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.User;
  },
);

export const GetToken = createParamDecorator(
  (_, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.token;
  },
);

export const GetIp = createParamDecorator(
  (_, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return (
      (req.headers['cf-connecting-ip'] as string) ||
      (req.socket.remoteAddress as string)
    );
  },
);
