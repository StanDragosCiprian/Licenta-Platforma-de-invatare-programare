import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
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
import * as fs from 'fs';
const fileHandle: IFileHandle = new FileHandle();
@Controller('courses')
export class CursController {
  constructor(private cursService: CursService) {}

  @Post('/new')
  @UseGuards(ProfessorGuard)
  async createCurs(
    @Cookies('id') id,
    @Body() createCursDto: CursDto,
  ): Promise<string> {
    const newCurs = await this.cursService.createNewCourse(createCursDto, id);
    return newCurs;
  }
  @Post('/rename/file')
  @UseGuards(ProfessorGuard)
  async renameFile(@Body() body: { email: string; newValue: string }) {
    const getProfessorNameByEmail = await this.cursService.getProfessorByEmail(
      body.email,
    );
    await this.cursService.renameFile(
      getProfessorNameByEmail.username.replace(' ', '_'),
      body.newValue.replace(' ', '_'),
      getProfessorNameByEmail.coursesId,
    );
  }
  @Post('/update')
  @UseGuards(ProfessorGuard)
  async updateCurs(
    @Cookies('id') id,
    @Body() createCursDto: any,
  ): Promise<number> {
    console.log(id);
    await this.cursService.updateCourse(createCursDto, id);
    return 0;
  }
  @Post('/:professorName/:videName/:coursName/add/video/Update/videoInput')
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(fileHandle.destinationVideo()),
      fileFilter: fileHandle.filterVideo(),
    }),
  )
  async updateVideoForVideoCurs(
    @Cookies('id') id: string,
    @Body('filename') filename: string,
    @Param('professorName') professorName: string,
    @Param('videName') videName: string,
    @Param('coursName') coursName: string,
  ) {
    const videoPath = await this.cursService.getVideoPathFromCourse(
      id,
      coursName,
      videName,
    );
    //from this videoPath=john2/test/Tp_1711204609822.mp4 make to look like this :videoPath=john2\\test\\Tp_1711204609822.mp4
    const videoPathArray = videoPath.split('/');
    const videoPathString = videoPathArray.join('\\');
    fs.unlinkSync(
      `${FILELOCATION}\\backend\\src\\VideoTutorial\\${videoPathString}`,
    );
    return `${professorName}/${coursName}/${filename}`;
  }
  @Post(
    '/:professorName/:videName/:coursName/:newTitle/add/pdf/Update/pdfInput',
  )
  @UseGuards(ProfessorGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(fileHandle.destinationVideo()),
      fileFilter: fileHandle.filterDocuments(),
    }),
  )
  async updatePdfForVideoCurs(
    @Cookies('id') id: string,
    @Body('filename') filename: string,
    @Param('professorName') professorName: string,
    @Param('videName') videName: string,
    @Param('coursName') coursName: string,
    @Param('newTitle') newTitle: string,
  ) {
    const videoPath = await this.cursService.getPdfPathFromCourse(
      id,
      coursName,
      videName,
    );
    if (filename !== undefined) {
      const videoPathArray = videoPath.split('/');
      const videoPathString = videoPathArray.join('\\');
      fs.unlinkSync(
        `${FILELOCATION}\\backend\\src\\VideoTutorial\\${videoPathString}`,
      );
    }
    const pdf: IDocumentFormat = {
      format: 'Pdf',
      title: newTitle,
      documentFormatName:
        filename !== undefined
          ? `${professorName}/${coursName}/${filename}`
          : '',
    };
    await this.cursService.updatePdfFromCourse(pdf, videName, id, coursName);
  }
  //make a post funtion which call this funtion from cursService updateVideoFromCourse
  @Post('/:coursName/:videoName/update/video')
  @UseGuards(ProfessorGuard)
  async updateVideo(
    @Cookies('id') id: string,
    @Body() file: IVideo,
    @Param('coursName') coursName: string,
    @Param('videoName') videoName: string,
  ) {
    await this.cursService.updateVideoFromCourse(
      file,
      videoName,
      id,
      coursName,
    );
  }
  @Post('/add/professors/to/couses')
  async addProfessorToCourse(
    @Body() body: { studentsEmail: string[]; courseName: string },
    @Cookies('id') id: string,
  ) {
    await this.cursService.addProfessorToCourses(
      id,
      body.studentsEmail,
      body.courseName,
    );

    return 0;
  }
  @Post('/add/students/to/couses')
  async addStudentToCourse(
    @Body() body: { studentsEmail: string[]; courseName: string },
    @Cookies('id') id: string,
  ) {
    await this.cursService.addStudentsToCourses(
      id,
      body.studentsEmail,
      body.courseName,
    );

    return 0;
  }
  @Get('/cursPresentation')
  async cursPresentation(@Cookies('id') id: string) {
    const curses: ICurs[] = await this.cursService.getCoursComponent(id);

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

    return coursesObject;
  }
  @Get('/:id/:coursName/vefiy/cours')
  async verifyCours(
    @Param('id') id: string,
    @Param('coursName') coursName: string,
  ) {
    return {
      isPageVerify: await this.cursService.findCoursFromProfessorEmail(
        id,
        coursName,
      ),
    };
  }
  @Get('/cursProfessor')
  async cursProfessor(@Cookies('id') id: string) {
    const curses: ICurs[] =
      await this.cursService.fetchProfessorVisibleCourses(id);

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
  @Get('/coursesProfessor/:courseName/video')
  async coursesProfessorVideo(
    @Cookies('id') id: string,
    @Param('courseName') courseName: string,
  ) {
    const video: IVideo[] | IDocumentFormat[] =
      await this.cursService.getProfessorMedia(id, courseName, 'Video');
    return video;
  }
  @Get('/coursesProfessor/:courseName/pdf')
  async coursesProfessorPdf(
    @Cookies('id') id: string,
    @Param('courseName') courseName: string,
  ) {
    const video: IVideo[] | IDocumentFormat[] =
      await this.cursService.getProfessorMedia(id, courseName, 'Pdf');
    return video;
  }
  @Get('/coursesProfessor/:courseName/compile')
  async coursesProfessorCompile(
    @Cookies('id') id: string,
    @Param('courseName') courseName: string,
  ) {
    const video: string[] = await this.cursService.getProfessorCompilator(
      id,
      courseName,
    );
    return video;
  }
  @Post('/coursesProfessor/:courseName/Update/compile')
  async coursesProfessorUpdateCompile(
    @Cookies('id') id: string,
    @Param('courseName') courseName: string,
    @Body() body: ICompilators & { oldTitle: string },
  ) {
    await this.cursService.updateCompilatorFromCourse(body, id, courseName);
  }
  @Get('/coursesProfessor/all')
  async coursesProfessor567all(@Cookies('id') id: string) {
    const curses: ICurs[] = await this.cursService.fetchProfessorCourses(id);

    const courses = curses.map((curs: ICurs) => {
      return {
        title: curs.name,
        description: curs.description,
        vizibility: curs.vizibility,
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
      const cours = await this.cursService.fetchProfessorCourses(id);
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
  @Get('/:professorId/:coursName/isJoin/cours')
  async isJoin(
    @Param('professorId') professorId: string,
    @Param('coursName') coursName: string,
    @Cookies('id') id: string,
  ) {
    console.log(professorId);
    console.log(coursName);
    console.log(id);

    let user = await this.cursService.isStudentInCours(
      professorId,
      coursName,
      id,
    );
    if (user === false) {
      user = await this.cursService.verifyProfessor(professorId, coursName, id);
    }
    return user;
  }
  @Post('/:professorId/:coursName/join/cours')
  // @UseGuards(StudentGuard)
  async addStudentToCours(
    @Param('professorId') professorId: string,
    @Param('coursName') coursName: string,
    @Body() id: { id: { name: string; value: string } },
  ) {
    this.cursService.addStudent(id.id.value, professorId, coursName);
    return { isUpdate: true };
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
    @Req() req: Request,
    @Cookies('id') id: string,
    @Body('filename') filename: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('professorName') professorName: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Param('coursName') coursName: string,
  ) {
    const { dest }: any = req.body;
    const finalDest =
      dest
        .replace(
          'E:\\Licenta-Platforma-de-invatare-programare\\backend\\src\\VideoTutorial\\',
          '',
        )
        .replace(/\\/g, '/') +
      '/' +
      filename;
    return finalDest;
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
    return `${professorName}/${coursName}/${filename}`;
  }
  @Get('/:professorName/:cursName/:pdfName/pdf')
  async getPdf(
    @Res() response,
    @Param('professorName') professorName: string,
    @Param('cursName') cursName: string,
    @Param('pdfName') videoName: string,
  ) {
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
