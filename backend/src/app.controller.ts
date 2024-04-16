import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { FILELOCATION } from 'EnviormentVariable';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('default/img')
  defaultImage(@Res() response) {
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\Images\\Default\\pngwing.com.png`,
    );
  }

  @Get('editcourses/videoImg')
  addVideoToCoursesImage(@Res() response) {
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\Images\\Courses\\uploadVideoImage.jpg`,
    );
  }

  @Get('default/cours/:id')
  defaultCoursImage1(@Res() response, @Param('id') id: string) {
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\Images\\Default\\defaultCours${id}.jpg`,
    );
  }

  @Get('error')
  errorImage(@Res() response) {
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\Images\\Default\\error.png`,
    );
  }

  @Get('editcourses/pdfImg')
  addPdfToCoursesImage(@Res() response) {
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\Images\\Courses\\uploadPdfImage.jpg`,
    );
  }

  @Get('pdfTest')
  addCodePdfTest(@Res() response) {
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\VideoTutorial\\dari\\Desen\\GrileRezolvate_BradImagini_1708097003234.pdf`,
    );
  }

  @Get('/exercices/tutorial')
  addCodeTutorial(@Res() response) {
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\Images\\Default\\TutorialExerices.pdf`,
    );
  }

  @Get('/add/professor/tutorial')
  addProfessorTutorial(@Res() response) {
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\Images\\Default\\TutorialAddProfessor.pdf`,
    );
  }

  @Get('editcourses/codeImg')
  addCodeToCoursesImage(@Res() response) {
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\Images\\Courses\\uploadCodeImage.jpg`,
    );
  }
}
