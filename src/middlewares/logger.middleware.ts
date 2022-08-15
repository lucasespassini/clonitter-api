import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private secret = process.env.JWT_SECRET;
  use(req: Request, res: Response, next: NextFunction) {
    const authToken = req.headers['authorization'];

    if (authToken != undefined) {
      const token = authToken.split(' ')[1];
      const decoded = verify(token, this.secret);
      if (decoded != undefined) {
        next();
      } else {
        res.status(403).send('Você não está logado!');
        return;
      }
    } else {
      res.status(403).send('Você não está logado!');
      return;
    }
  }
}
