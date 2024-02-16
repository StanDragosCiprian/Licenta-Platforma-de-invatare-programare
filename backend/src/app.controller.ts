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
  @Get('editcourses/videoImg')
  addVideoToCoursesImage(@Res() response) {
    response.sendFile(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Images\\Courses\\uploadVideoImage.jpg',
    );
  }
  //defaultCours1.jpg
  @Get('default/cours1')
  defaultCoursImage1(@Res() response) {
    response.sendFile(
      'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\Images\\Default\\defaultCours1.jpg',
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
