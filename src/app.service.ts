import { Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AppService {
  private secret = '9uj21=09rj210´rj';
  async validate(authToken: string) {
    const token = authToken.split(' ')[1];
    const decoded = verify(token, this.secret);

    return decoded;
  }
}
