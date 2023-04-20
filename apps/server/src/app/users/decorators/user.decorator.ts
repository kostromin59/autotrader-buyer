import { IUser } from '@autotrader/interfaces';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../../../interfaces/request-with-user.interface';

// Get user or fields of user
export const CurrentUser = createParamDecorator(
  (key: keyof Omit<IUser, 'password'>, ctx: ExecutionContext) => {
    const request: RequestWithUser = ctx.switchToHttp().getRequest();

    const user = request.user;
    delete user.password;

    return key ? user[key] : user;
  }
);
