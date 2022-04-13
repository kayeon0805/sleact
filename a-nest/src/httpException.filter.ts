import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | string
      | { error: string; statusCode: 400; message: string[] };

    console.log(status, err);
    response.status(status).json({ msg: err });
  }
}