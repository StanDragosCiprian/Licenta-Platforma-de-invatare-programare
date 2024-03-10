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
import { Cookies } from 'src/Cookie/cookie';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { Types } from 'mongoose';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { FileHandle, IFileHandle } from './FileHandle';
import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';
import { FILELOCATION } from 'EnviormentVariable';
import { ICompilatorUser } from 'src/Schemas/Entity/ICompilatorUser';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
const fileHandle: IFileHandle = new FileHandle();
@Controller('curs')
export class CursController {
  constructor(private cursService: CursService) {}

  //Cours funcion
  @Post('/new')
  @UseGuards(ProfessorGuard)
  async createCurs(
    @Cookies('id') id,
    @Body() createCursDto: CursDto,
  ): Promise<string> {
    const newCurs = await this.cursService.createNewCourse(createCursDto, id);
    return newCurs;
  }
  @Get('/cursPresentation')
  async cursPresentation() {
    const curses: ICurs[] = await this.cursService.getCoursComponent();
    console.log('curses: ', curses);

    const courses = await Promise.all(
      curses.map(async (curs: ICurs) => {
        const professorData = await this.cursService.findCourseWithProfessor(
          curs._id,
        );
        const encryptedText = await this.cursService.encryptText(
          professorData.toString(),
        );
        return {
          title: curs.name,
          description: curs.description,
          image: curs.imagePath,
          professor: encryptedText,
        };
      }),
    );
    const coursesObject = courses.reduce((obj, item, index) => {
      obj[index] = item;
      return obj;
    }, {});
    console.log('coursesObject: ', coursesObject);

    return coursesObject;
  }
  @Get('/:id/:coursName/vefiy/cours')
  async verifyCours(
    @Param('id') id: string,
    @Param('coursName') coursName: string,
  ) {
    return {
      isPageVerify: await this.cursService.findCoursFromProfessor(
        id,
        coursName,
      ),
    };
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
  async professorVerifyCours(
    @Cookies('id') id: string,
    @Param('nameCours') nameCours: string,
  ): Promise<boolean> {
    if (id !== 'undefined') {
      const cours = await this.cursService.getProfessorCurs(id);
      return cours !== null
        ? cours.some((c: ICurs) => c.name == nameCours)
        : false;
    }
    return false;
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
  //Video function
  @Get('/:coursName/:id/get/cours')
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
      `${FILELOCATION}\\backend\\src\\VideoTutorial\\${professorName}\\${cursName}\\${videoName}.${extension}`,
    );
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\VideoTutorial\\${professorName}\\${cursName}\\${videoName}.${extension}`,
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
    const cursId: Types.ObjectId = await this.cursService.takeCoursId(coursId);
    const videoDto = createCursDto;
    videoDto.format = 'Video';
    const curs = await this.cursService.addMediaFormat(cursId, videoDto);
    return await curs.toString();
  }
  //Pdf funcioon
  @Post('/:professorName/:coursName/:title/add/document/Docs')
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(fileHandle.destinationVideo()),
      fileFilter: fileHandle.filterDocuments(),
    }),
  )
  async createPdfCurs(
    @Body('filename') filename: string,
    @Param('coursName') coursName: string,
    @Param('professorName') professorName: string,
    @Param('title') title: string,
  ) {
    const cursId: Types.ObjectId =
      await this.cursService.takeCoursId(coursName);
    const videoDto: IDocumentFormat = {
      format: 'Pdf',
      title: `${title}`,
      documentFormatName: `${professorName}/${coursName}/${filename}`,
    };
    await this.cursService.addMediaFormat(cursId, videoDto);
    console.log(`${professorName}/${coursName}/${filename}`);
    return `${professorName}/${coursName}/${filename}`;
  }
  @Get('/:professorName/:cursName/:pdfName/pdf')
  async getPdf(
    @Res() response,
    @Param('professorName') professorName: string,
    @Param('cursName') cursName: string,
    @Param('pdfName') videoName: string,
  ) {
    console.log(
      `${FILELOCATION}\\backend\\src\\VideoTutorial\\${professorName}\\${cursName}\\${videoName}.pdf`,
    );
    response.sendFile(
      `${FILELOCATION}\\backend\\src\\VideoTutorial\\${professorName}\\${cursName}\\${videoName}.pdf`,
    );
  }
  //Compiler function

  @Get('/:professor/:coursName/:language/:id/compile')
  async chooseCompilerEndPoint(
    @Param('language') language: string,
    @Param('id') id: string,
    @Param('professor') professor: string,
    @Param('coursName') coursName: string,
  ): Promise<string> {
    console.log(professor, language, id, coursName);
    const curs: ICompilators = await this.cursService.getCoursFromProfessor(
      professor,
      coursName,
      id,
    );

    const choose = await this.cursService.chooseCompiler(
      this.makeCompilerDto(curs, language, ''),
    );
    return choose;
  }
  private makeCompilerDto(
    curs: ICompilators,
    language: string,
    scripts: string,
  ) {
    const test = curs.problemParameter.split(',');
    const j = {};

    test.forEach((t: string) => {
      const c = t.split('.');
      j[c[1]] = c[0];
    });
    console.log(j);
    const compilerDto: ICompilatorUser = {
      programmingLanguage: language,
      functionName: curs.funtionProblemModel,
      parameterWithType: JSON.parse(JSON.stringify(j)),
      scripts: scripts,
    };
    return compilerDto;
  }
  @Post('/:professor/:coursName/:language/:id/execute/script')
  async executeScripts(
    @Body() scripts: { script: string },
    @Param('language') language: string,
    @Param('id') id: string,
    @Param('professor') professor: string,
    @Param('coursName') coursName: string,
  ) {
    const curs: ICompilators = await this.cursService.getCoursFromProfessor(
      professor,
      coursName,
      id,
    );
    console.log('curs: ', this.takeParameterValue(curs.problemInputs, 'Input'));
    const output = this.takeParameterValue(curs.problemOutputs, 'Output');

    const inputs = this.takeParameterValue(curs.problemInputs, 'Input');
    for (let index = 0; index < inputs.length; index++) {
      const input = inputs[index];
      const exec = await this.cursService.executeScripts(
        this.makeCompilerDto(curs, language, scripts.script),
        input,
      );
      const e = exec.toString().replace('\r\n', '');

      if (e !== output[index]) {
        console.log('e: ', e);
        return {
          isAlgorithmOk: false,
          input: input,
          yourOutput: e,
          expected: output[index],
        };
      }
    }

    return {
      isAlgorithmOk: true,
      input: '',
      yourOutput: '',
      expected: '',
    };
  }
  private takeParameterValue(input: string[], type: string): string[] {
    return input.map((item) => {
      return item.replace(`${type}(`, '').replace(')', '');
    });
  }
  @Post('/:coursName/new/exercices')
  @UseGuards(ProfessorGuard)
  async newExercies(
    @Body() exercices: ICompilators,
    @Param('coursName') coursName: string,
  ) {
    const cursId: Types.ObjectId =
      await this.cursService.takeCoursId(coursName);
    console.log(exercices);
    return await this.cursService.addMediaFormat(cursId, exercices);
  }
  @Get('/:professor/:coursName/:id/get/exercices/format')
  async getCompilerFormat(
    @Param('coursName') coursName: string,
    @Param('professor') professor: string,
    @Param('id') id: string,
  ) {
    const curs: ICompilators = await this.cursService.getCoursFromProfessor(
      professor,
      coursName,
      id,
    );
    return {
      title: curs.title,
      problemRequire: curs.problemRequire,
      problemExemples: curs.problemExemples,
      format: curs.format,
    };
  }
}
