import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class NotLoggedInGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // passport는 request 객체에 isAuthenticated() 라는 메소드를 자동으로 만들어준다.
    return !request.isAuthenticated();
  }
}
