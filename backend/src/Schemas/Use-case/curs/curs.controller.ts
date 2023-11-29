import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CursDto } from 'src/Schemas/DTO/curs.dto';
import { CursService } from './curs.service';
// import { IVideo } from 'src/Schemas/Entity/IVideo';
import { ErrorInterceptor } from '../ErrorInterceptor';
import { IPdf } from 'src/Schemas/Entity/IPdf';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
import { Cookies } from 'src/Cookie/cookie';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { Types } from 'mongoose';
import { ICurs } from 'src/Schemas/Entity/ICurs';

@Controller('curs')
export class CursController {
  constructor(private cursService: CursService) {}
  private resp = new ResponseStatus();
  @Post('/new')
  @UseGuards(ProfessorGuard)
  async createCurs(
    @Cookies() id,
    @Body() createCursDto: CursDto,
  ): Promise<any> {
    const newCurs = await this.cursService.createNewCourse(
      createCursDto,
      id.id,
    );
    return newCurs;
  }
  @Get('/cursPresentation')
  async cursPresentation() {
    const curses: ICurs[] = await this.cursService.getCoursComponent();

    const courses = curses.map((curs: ICurs) => {
      return {
        title: curs.name,
        description: curs.description,
        image: curs.imagePath,
      };
    });

    const coursesObject = courses.reduce((obj, item, index) => {
      obj[index] = item;
      return obj;
    }, {});

    return coursesObject;
  }
  @Get('/cursProfessor')
  async cursProfessor(@Cookies('id') id: string) {
    const curses: ICurs[] = await this.cursService.getProfessorCurs(id);

    const courses = curses.map((curs: ICurs) => {
      return {
        title: curs.name,
        description: curs.description,
        image: curs.imagePath,
      };
    });

    const coursesObject = courses.reduce((obj, item, index) => {
      obj[index] = item;
      return obj;
    }, {});

    return coursesObject;
  }
  @Get('/professorName')
  @UseGuards(ProfessorGuard)
  async professorName(@Cookies('id') id: string): Promise<string> {
    console.log('id: ', id);
    return await this.cursService.getProfessorNameForCours(id);
  }

  @Get('/:coursName')
  async getCoursName(@Param('coursName') coursId: string) {
    const name = await this.cursService.takeName(coursId);
    return name;
  }
  @Get('/:coursName/fullCours')
  async getFullCours(@Param('coursName') coursId: string) {
    return await this.cursService.takeCoursByName(coursId);
  }
  @Get('/:cursName/:drag/:drop/dragAndDrop')
  async dragDrop(
    @Param('drag') drag: string,
    @Param('drop') drop: string,
    @Param('cursName') cursName: string,
  ) {
    this.cursService.changeIndex(cursName, drag, drop);
  }
  @Get('/:coursName/:id/videoCurs')
  async getCours(
    @Param('coursName') coursName: string,
    @Param('id') id: string,
  ) {
    const name = await this.cursService.takeFullCurs(coursName);
    console.log('name: ', name);
    return name.curs[id];
  }
  @Get('/:coursName/videoCurs')
  async getCoursFullCurs(@Param('coursName') coursName: string) {
    const name = await this.cursService.takeFullCurs(coursName);
    console.log('name: ', name);
    const m = name.curs.map((cours: any) => {
      return { title: cours.title };
    });
    console.log(m);
    return m;
  }
  @Get('/:professorName/:cursName/:videoName/:extension/video')
  async getVideo(
    @Res() response,
    @Param('professorName') professorName: string,
    @Param('cursName') cursName: string,
    @Param('videoName') videoName: string,
    @Param('extension') extension: string,
  ) {
    response.sendFile(
      `E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\VideoTutorial\\${professorName}\\${cursName}\\${videoName}.${extension}`,
    );
  }
  @Post('/:professorName/:coursName/add/video/videoInput')
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: Request, file, cb) => {
          const coursName = req.params.coursName;
          const professorName = req.params.professorName;
          const dest = `E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\VideoTutorial\\${professorName}\\${coursName}`;
          if (!existsSync(dest)) {
            mkdirSync(dest, { recursive: true });
          }
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;
          req.body.filename = newFileName;
          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = [
          'video/mp4',
          'video/x-msvideo',
          'video/quicktime',
        ];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    }),
  )
  async addVideoForVideoCurs(
    @Cookies('id') id: string,
    @Body('filename') filename: string,
  ) {
    return `${filename}`;
  }
  @Post('/:coursName/add/video/textInput')
  @UseGuards(ProfessorGuard)
  async createTextForVideoCurs(
    @Param('coursName') coursId: string,
    @Body() createCursDto: IVideo,
  ): Promise<string> {
    const cursId: Types.ObjectId = await this.cursService.takeCours(coursId);
    const curs = await this.cursService.addVideoToVide(cursId, createCursDto);
    console.log('curs: ', curs);
    return await curs.toString();
  }

  @Post('/new/pdf')
  @UseInterceptors(ErrorInterceptor)
  async createPdfCurs(@Res() response, @Body() PdfDto: IPdf) {
    if (this.resp.hasSameKeys(PdfDto, this.resp.pdfKeys)) {
      const newCurs = await this.cursService.addPdfToCurs(
        '6528206c40e8e31219a642a2',
        PdfDto,
      );
      return this.resp.goodResponse(response, newCurs);
    }
    return this.resp.badResponse(response);
  }
  @Post('/new/compilator')
  @UseInterceptors(ErrorInterceptor)
  async createCompilatorCurs(
    @Res() response,
    @Body() compilatorDto: ICompilators,
  ) {
    if (this.resp.hasSameKeys(compilatorDto, this.resp.compilatorKeys)) {
      const newCompilator = await this.cursService.addCompilatorToCurs(
        '6528206c40e8e31219a642a2',
        compilatorDto,
      );
      return this.resp.goodResponse(response, newCompilator);
    }
    return this.resp.badResponse(response);
  }
}
