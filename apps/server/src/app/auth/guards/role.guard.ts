import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RequestWithUser } from '../../../interfaces/request-with-user.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly role: string) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;

    return this.role === user.role;
  }
}
