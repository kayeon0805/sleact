import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
// Middleware를 NestJS 에서 구현하기 위해서는 NestMiddleware Interface를 implements하여 구현
// => use 함수가 필수이다.
export class LoggerMiddleware implements NestMiddleware {
  // context 지정
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    // 1. 미들웨어 시작할 때 request 기록
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    // 3. router 끝나고 로깅 (비동기)
    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    // 2. router로 이동
    next();
  }
}
