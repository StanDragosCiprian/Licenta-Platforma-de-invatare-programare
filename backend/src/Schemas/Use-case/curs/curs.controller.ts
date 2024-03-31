import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CursDto } from 'src/Schemas/DTO/curs.dto';
import { CursService } from './curs.service';
import { Cookies } from 'src/Cookie/cookie';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { ICurs } from 'src/Schemas/Entity/ICurs';
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
  @Get('/:coursName/:id/get/cours')
  async getCours(
    @Param('coursName') coursName: string,
    @Param('id') id: string,
  ) {
    const name = await this.cursService.takeFullCurs(coursName);
    return name.curs[id];
  }
}
