import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('default/img')
  defaultImage(@Res() response) {
    response.sendFile(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Images\\Default\\pngwing.com.png',
    );
  }
  @Get('editcourses/img')
  editCourses(@Res() response) {
    response.sendFile(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Images\\Courses\\sketchbook.jpg',
    );
  }
}
