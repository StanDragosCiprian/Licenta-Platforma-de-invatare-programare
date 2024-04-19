import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CoursesDto } from 'src/Schemas/DTO/courses.dto';
import { CoursesService } from './courses.service';
import { Cookies } from 'src/Cookie/cookie';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { ICourses } from 'src/Schemas/Entity/ICourses';
import { Types } from 'mongoose';
import { AdminGuard } from 'src/auth/admin.guard';
@Controller('courses')
export class CoursesController {
  constructor(private courseService: CoursesService) {}
  @Post('/new')
  @UseGuards(ProfessorGuard)
  async createCourse(
    @Cookies('id') id,
    @Body() createCourseDto: CoursesDto,
  ): Promise<string> {
    try {
      const newCourse = await this.courseService.createNewCourse(
        createCourseDto,
        id,
      );
      return newCourse;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while creating the course.');
    }
  }
  @Get('/:coursName/get/course/name/preview')
  async getCoursFullCourse(@Param('coursName') coursName: string) {
    try {
      const name = await this.courseService.takeFullCourse(coursName);
      const m = name.courses.map((cours: any) => {
        return { title: cours.title, format: cours.format };
      });
      return m;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while fetching the full course.');
    }
  }
  @Post('/rename/file')
  @UseGuards(ProfessorGuard)
  async renameFile(@Body() body: { email: string; newValue: string }) {
    try {
      const getProfessorNameByEmail =
        await this.courseService.getProfessorByEmail(body.email);
      await this.courseService.renameFile(
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
      await this.courseService.deleteCourse(courseName, id);
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
    @Body() createCourseDto: any,
  ): Promise<number> {
    try {
      await this.courseService.updateCourse(createCourseDto, id);
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
      await this.courseService.addProfessorToCourses(
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
      await this.courseService.addStudentsToCourses(
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
  @Get('/coursesPresentation')
  async coursesPresentation(@Cookies('id') id: string) {
    try {
      const myCourses: ICourses[] =
        await this.courseService.getCoursComponent(id);
      const courses = await Promise.all(
        myCourses.map(async (course: ICourses) => {
          const professorData =
            await this.courseService.findCourseWithProfessor(course._id);
          const encryptedText = await this.courseService.encryptText(
            professorData.toString(),
          );
          return {
            title: course.name,
            description: course.description,
            image: course.imagePath,
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
  @Get('/myCourses')
  async myCourses(@Cookies('id') id: string) {
    try {
      const myCourses: ICourses[] =
        await this.courseService.getMyCoursComponent(id);
      const courses = await Promise.all(
        myCourses.map(async (course: ICourses) => {
          const professorData =
            await this.courseService.findCourseWithProfessor(course._id);
          const encryptedText = await this.courseService.encryptText(
            professorData.toString(),
          );
          return {
            title: course.name,
            description: course.description,
            image: course.imagePath,
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
        isPageVerify: await this.courseService.findCoursFromProfessorEmail(
          id,
          coursName,
        ),
      };
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while verifying the course.');
    }
  }
  @Post('/delete/professor/courses')
  @UseGuards(AdminGuard)
  async getProfessorCoursesAndDelete(@Body() body: { email: string }) {
    try {
      const professor = await this.courseService.getProfessorByEmail(
        body.email,
      );
      const courses = professor.coursesId;
      const id = await this.courseService.encryptProfessorJwt(professor);
      for (const course of courses) {
        const cours = await this.courseService.takeCours(course);
        await this.courseService.deleteCourse(cours.name, id.access_token);
      }
    } catch (error) {}
  }
  @Get('/coursesProfessor')
  async coursesProfessor(@Cookies('id') id: string) {
    try {
      const professorCourses: ICourses[] =
        await this.courseService.fetchProfessorVisibleCourses(id);

      const courses = professorCourses.map((course: ICourses) => {
        return {
          title: course.name,
          description: course.description,
          image: course.imagePath,
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
      const professorCourses: ICourses[] =
        await this.courseService.fetchProfessorCourses(id);
      const courses = professorCourses.map((course: ICourses) => {
        if (
          course &&
          'name' in course &&
          'description' in course &&
          'vizibility' in course &&
          'imagePath' in course
        ) {
          return {
            title: course.name,
            description: course.description,
            vizibility: course.vizibility,
            image: course.imagePath,
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
      return await this.courseService.getProfessorNameForCours(id);
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while fetching the professor name.');
    }
  }
  @Get('/professorVerifyCourse/:nameCours')
  async professorVerifyCourse(
    @Cookies('id') id: string,
    @Param('nameCours') nameCours: string,
  ): Promise<boolean> {
    try {
      if (id !== 'undefined') {
        const cours = await this.courseService.fetchProfessorCourses(id);
        const profesessor =
          cours !== null
            ? cours.some((c: ICourses) => c.name == nameCours)
            : false;
        if (!profesessor) {
          const colab =
            await this.courseService.takeColaboratoryByCourseName(nameCours);
          const colaboratory = colab.some(
            async (c: Types.ObjectId) =>
              c ==
              new Types.ObjectId(await this.courseService.decryptProfessor(id)),
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
      const name = await this.courseService.takeName(coursId);
      return name;
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while fetching the course name.');
    }
  }
  @Get('/:coursName/fullCours')
  async getFullCours(@Param('coursName') coursId: string) {
    try {
      return await this.courseService.takeCoursByName(coursId);
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
      const user = await this.courseService.isStudentInCours(
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
  async addStudentToCours(
    @Param('professorId') professorId: string,
    @Param('coursName') coursName: string,
    @Body() id: { id: { name: string; value: string } },
  ) {
    try {
      this.courseService.addStudent(id.id.value, professorId, coursName);
      return { isUpdate: true };
    } catch (error) {
      console.error(error);
      throw new Error(
        'An error occurred while adding the student to the course.',
      );
    }
  }
  @Get('/:courseName/:drag/:drop/dragAndDrop')
  async dragDrop(
    @Param('drag') drag: string,
    @Param('drop') drop: string,
    @Param('courseName') courseName: string,
  ) {
    try {
      await this.courseService.changeIndex(courseName, drag, drop);
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
      const name = await this.courseService.takeFullCourse(coursName);
      return name.courses[id];
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while fetching the course.');
    }
  }
}
