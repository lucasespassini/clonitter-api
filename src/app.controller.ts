import { Controller, Headers, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/validate')
  validate(@Headers('authorization') authToken: string) {
    return this.appService.validate(authToken);
  }
}
