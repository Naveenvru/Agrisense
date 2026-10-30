import { BadRequestException, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleLinkGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const state = request.query.state;
    if (typeof state !== 'string' || !/^[a-f0-9]{64}$/i.test(state)) throw new BadRequestException('Start Google linking from Account Settings');
    return { state };
  }
}
