import { Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AppService {
  private secret = process.env.JWT_SECRET;
  async validate(authToken: string) {
    const token = authToken.split(' ')[1];
    const decoded = verify(token, this.secret);
    return decoded;
  }
}
