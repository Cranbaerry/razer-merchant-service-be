import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UsePublic } from './guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UsePublic()
  getHello(): string {
    return this.appService.getHello();
  }
}
