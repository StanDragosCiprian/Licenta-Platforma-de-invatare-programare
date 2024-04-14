import { Controller, Get, Param, Res } from '@nestjs/common';
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
  @Get('editcourses/videoImg')
  addVideoToCoursesImage(@Res() response) {
    response.sendFile(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Images\\Courses\\uploadVideoImage.jpg',
    );
  }
  //defaultCours1.jpg
  @Get('default/cours/:id')
  defaultCoursImage1(@Res() response, @Param('id') id: string) {
    response.sendFile(
      `E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Images\\Default\\defaultCours${id}.jpg`,
    );
  }
  @Get('error')
  errorImage(@Res() response) {
    response.sendFile(
      `E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Images\\Default\\error.png`,
    );
  }
  @Get('editcourses/pdfImg')
  addPdfToCoursesImage(@Res() response) {
    response.sendFile(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Images\\Courses\\uploadPdfImage.jpg',
    );
  }
  @Get('pdfTest')
  addCodePdfTest(@Res() response) {
    response.sendFile(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\VideoTutorial\\dari\\Desen\\GrileRezolvate_BradImagini_1708097003234.pdf',
    );
  }
  @Get('editcourses/codeImg')
  addCodeToCoursesImage(@Res() response) {
    response.sendFile(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Images\\Courses\\uploadCodeImage.jpg',
    );
  }
}
