import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CoursesDto } from 'src/Schemas/DTO/courses.dto';
import { CursService } from './courses.service';
import { Cookies } from 'src/Cookie/cookie';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { Types } from 'mongoose';
@Controller('courses')
export class CursController {
  constructor(private cursService: CursService) {}
  @Post('/new')
  @UseGuards(ProfessorGuard)
  async createCurs(
    @Cookies('id') id,
    @Body() createCursDto: CoursesDto,
  ): Promise<string> {
    try {
      const newCurs = await this.cursService.createNewCourse(createCursDto, id);
      return newCurs;
    } catch (error) {
      // Handle the exception here
      console.error(error);
      throw new Error('An error occurred while creating the course.');
    }
  }
  @Get('/:coursName/get/course/name/preview')
  async getCoursFullCurs(@Param('coursName') coursName: string) {
    try {
      const name = await this.cursService.takeFullCurs(coursName);
      const m = name.curs.map((cours: any) => {
        return { title: cours.title, format: cours.format };
      });
      return m;
    } catch (error) {
      // Handle the exception here
      console.error(error);
      throw new Error('An error occurred while fetching the full course.');
    }
  }
  @Post('/rename/file')
  @UseGuards(ProfessorGuard)
  async renameFile(@Body() body: { email: string; newValue: string }) {
    try {
      const getProfessorNameByEmail =
        await this.cursService.getProfessorByEmail(body.email);
      await this.cursService.renameFile(
        getProfessorNameByEmail.username.replace(' ', '_'),
        body.newValue.replace(' ', '_'),
        getProfessorNameByEmail.coursesId,
      );
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while renaming the file.');
    }
  }
  @Post('/:courseName/delete')
  @UseGuards(ProfessorGuard)
  async deleteCourse(
    @Cookies('id') id,
    @Param('courseName') courseName: string,
  ): Promise<number> {
    try {
      await this.cursService.deleteCourse(courseName, id);
      return 0;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while deleting the course.');
    }
  }
  @Post('/update')
  @UseGuards(ProfessorGuard)
  async updateCourse(
    @Cookies('id') id,
    @Body() createCursDto: any,
  ): Promise<number> {
    try {
      await this.cursService.updateCourse(createCursDto, id);
      return 0;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while updating the course.');
    }
  }
  @Post('/add/professors/to/courses')
  async addProfessorToCourse(
    @Body() body: { studentsEmail: string[]; courseName: string },
    @Cookies('id') id: string,
  ) {
    try {
      await this.cursService.addProfessorToCourses(
        id,
        body.studentsEmail,
        body.courseName,
      );
      return 0;
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while adding professors to the course.',
      );
    }
  }
  @Post('/add/students/to/couses')
  async addStudentToCourse(
    @Body() body: { studentsEmail: string[]; courseName: string },
    @Cookies('id') id: string,
  ) {
    try {
      await this.cursService.addStudentsToCourses(
        id,
        body.studentsEmail,
        body.courseName,
      );
      return 0;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while adding students to the course.');
    }
  }
  @Get('/cursPresentation')
  async cursPresentation(@Cookies('id') id: string) {
    try {
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
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while fetching the course presentation.',
      );
    }
  }
  @Get('/:id/:coursName/vefiy/cours')
  async verifyCours(
    @Param('id') id: string,
    @Param('coursName') coursName: string,
  ) {
    try {
      return {
        isPageVerify: await this.cursService.findCoursFromProfessorEmail(
          id,
          coursName,
        ),
      };
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while verifying the course.');
    }
  }
  @Get('/cursProfessor')
  async cursProfessor(@Cookies('id') id: string) {
    try {
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
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while fetching the professor courses.',
      );
    }
  }

  @Get('/coursesProfessor/all')
  async coursesProfessor567all(@Cookies('id') id: string) {
    try {
      const curses: ICurs[] = await this.cursService.fetchProfessorCourses(id);
      const courses = curses.map((curs: ICurs) => {
        if (
          curs &&
          'name' in curs &&
          'description' in curs &&
          'vizibility' in curs &&
          'imagePath' in curs
        ) {
          return {
            title: curs.name,
            description: curs.description,
            vizibility: curs.vizibility,
            image: curs.imagePath,
          };
        }
      });

      const coursesObject = courses.reduce((obj, item, index) => {
        obj[index] = item;
        return obj;
      }, {});

      return coursesObject;
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while fetching the professor courses.',
      );
    }
  }
  @Get('/professorName')
  @UseGuards(ProfessorGuard)
  async professorName(@Cookies('id') id: string): Promise<string> {
    try {
      return await this.cursService.getProfessorNameForCours(id);
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while fetching the professor name.');
    }
  }
  @Get('/professorVerifyCours/:nameCours')
  async professorVerifyCours(
    @Cookies('id') id: string,
    @Param('nameCours') nameCours: string,
  ): Promise<boolean> {
    try {
      if (id !== 'undefined') {
        const cours = await this.cursService.fetchProfessorCourses(id);
        const profesessor =
          cours !== null
            ? cours.some((c: ICurs) => c.name == nameCours)
            : false;
        if (!profesessor) {
          const colab =
            await this.cursService.takeColaboratoryByCourseName(nameCours);
          const colaboratory = colab.some(
            async (c: Types.ObjectId) =>
              c ==
              new Types.ObjectId(await this.cursService.decryptProfessor(id)),
          );
          return colaboratory;
        }
        return profesessor;
      }
      return false;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while verifying the course.');
    }
  }
  @Get('/:coursName')
  async getCoursName(@Param('coursName') coursId: string) {
    try {
      const name = await this.cursService.takeName(coursId);
      return name;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while fetching the course name.');
    }
  }
  @Get('/:coursName/fullCours')
  async getFullCours(@Param('coursName') coursId: string) {
    try {
      return await this.cursService.takeCoursByName(coursId);
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while fetching the full course.');
    }
  }
  @Get('/:professorId/:coursName/isJoin/cours')
  async isJoin(
    @Param('professorId') professorId: string,
    @Param('coursName') coursName: string,
    @Cookies('id') id: string,
  ) {
    try {
      const user = await this.cursService.isStudentInCours(
        professorId,
        coursName,
        id,
      );
      return user !== undefined ? user : false;
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while checking if the student has joined the course.',
      );
    }
  }
  @Post('/:professorId/:coursName/join/cours')
  // @UseGuards(StudentGuard)
  async addStudentToCours(
    @Param('professorId') professorId: string,
    @Param('coursName') coursName: string,
    @Body() id: { id: { name: string; value: string } },
  ) {
    try {
      this.cursService.addStudent(id.id.value, professorId, coursName);
      return { isUpdate: true };
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while adding the student to the course.',
      );
    }
  }
  @Get('/:cursName/:drag/:drop/dragAndDrop')
  async dragDrop(
    @Param('drag') drag: string,
    @Param('drop') drop: string,
    @Param('cursName') cursName: string,
  ) {
    try {
      await this.cursService.changeIndex(cursName, drag, drop);
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while performing the drag and drop operation.',
      );
    }
  }
  @Get('/:coursName/:id/get/cours')
  async getCours(
    @Param('coursName') coursName: string,
    @Param('id') id: string,
  ) {
    try {
      const name = await this.cursService.takeFullCurs(coursName);
      return name.curs[id];
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while fetching the course.');
    }
  }
}
