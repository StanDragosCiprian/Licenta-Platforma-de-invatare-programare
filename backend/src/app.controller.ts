import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('default/img')
  defaultImage(@Res() response) {
    response.sendFile(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Images\\Default\\pngwing.com.png',
    );
  }
}
