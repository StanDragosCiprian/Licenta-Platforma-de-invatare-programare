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
import { ResponseStatus } from 'src/Schemas/Use-case/ResponseStatus';
import { Cookies } from 'src/Cookie/cookie';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { Types } from 'mongoose';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { FileHandle, IFileHandle } from './FileHandle';
const fileHandle: IFileHandle = new FileHandle();
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
    return await this.cursService.getProfessorNameForCours(id);
  }
  @Get('/professorVerifyCours/:nameCours')
  @UseGuards(ProfessorGuard)
  async professorVerifyCours(
    @Cookies('id') id: string,
    @Param('nameCours') nameCours: string,
  ): Promise<boolean> {
    const cours = await this.cursService.getProfessorCurs(id);
    return cours.some((c: ICurs) => c.name == nameCours);
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
    return name.curs[id];
  }
  @Get('/:coursName/videoCurs')
  async getCoursFullCurs(@Param('coursName') coursName: string) {
    const name = await this.cursService.takeFullCurs(coursName);
    console.log('name: ', name);
    const m = name.curs.map((cours: any) => {
      return { title: cours.title };
    });
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
    console.log(
      `E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\VideoTutorial\\${professorName}\\${cursName}\\${videoName}.${extension}`,
    );
    response.sendFile(
      `E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\VideoTutorial\\${professorName}\\${cursName}\\${videoName}.${extension}`,
    );
  }
  @Post('/:professorName/:coursName/add/video/videoInput')
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(fileHandle.destinationVideo()),
      fileFilter: fileHandle.filterVideo(),
    }),
  )
  async addVideoForVideoCurs(
    @Cookies('id') id: string,
    @Body('filename') filename: string,
    @Param('professorName') professorName: string,
    @Param('coursName') coursName: string,
  ) {
    console.log(`${professorName}/${coursName}/${filename}`);
    return `${professorName}/${coursName}/${filename}`;
  }
  @Post('/:coursName/add/video/textInput')
  @UseGuards(ProfessorGuard)
  async createTextForVideoCurs(
    @Param('coursName') coursId: string,
    @Body() createCursDto: IVideo,
  ): Promise<string> {
    const cursId: Types.ObjectId = await this.cursService.takeCours(coursId);
    const videoDto = createCursDto;
    videoDto.format = 'Video';
    const curs = await this.cursService.addVideoToVide(cursId, videoDto);
    return await curs.toString();
  }

  @Post('/:professorName/:coursName/add/document/Docs')
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(fileHandle.destinationVideo()),
      fileFilter: fileHandle.filterDocuments(),
    }),
  )
  async createPdfCurs(@Body('filename') filename: string) {
    console.log(`${filename}`);
    return `${filename}`;
  }
  // @Post('/new/compilator')
  // @UseInterceptors(ErrorInterceptor)
  // async createCompilatorCurs(
  //   @Res() response,
  //   @Body() compilatorDto: ICompilators,
  // ) {
  //   if (this.resp.hasSameKeys(compilatorDto, this.resp.compilatorKeys)) {
  //     const newCompilator = await this.cursService.addCompilatorToCurs(
  //       '6528206c40e8e31219a642a2',
  //       compilatorDto,
  //     );
  //     return this.resp.goodResponse(response, newCompilator);
  //   }
  //   return this.resp.badResponse(response);
  // }
}
