import { Injectable, Logger as LogGeral, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new LogGeral('RoutesResolver');

  use(request: Request, response: Response, next: NextFunction): void {
    const start = new Date().getTime();
    const { ip, method, originalUrl } = request;

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const elapsed = new Date().getTime() - start;
      this.logger.log(
        `${method} - '${originalUrl}' - ${statusCode} - ${contentLength} - ${ip} - +${elapsed}ms`,
      );
    });

    next();
  }
}
