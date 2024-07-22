import { Constructor } from 'EnviormentVariable';
import { CoursesService } from '../courses.service';
import { Body, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { Cookies } from 'src/Cookie/cookie';
import { CoursesDto } from 'src/Schemas/DTO/courses.dto';
import { ICourses } from 'src/Schemas/Entity/ICourses';
import { AdminGuard } from 'src/auth/admin.guard';

export function CoursesCrudController<TBase extends Constructor>(Base: TBase) {
  abstract class CRUD extends Base {
    abstract _courseService: CoursesService;
    @Post('/new')
    @UseGuards(ProfessorGuard)
    async createCourse(
      @Cookies('id') id,
      @Body() createCourseDto: CoursesDto,
    ): Promise<string> {
      try {
        const newCourse = await this._courseService.createNewCourse(
          createCourseDto,
          id,
        );
        return newCourse;
      } catch (error) {
        console.error(error);
        throw new Error('An error occurred while creating the course.');
      }
    }

    @Post('/:courseName/delete')
    @UseGuards(ProfessorGuard)
    async deleteCourse(
      @Cookies('id') id,
      @Param('courseName') courseName: string,
    ): Promise<number> {
      try {
        await this._courseService.deleteCourse(courseName, id);
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
        await this._courseService.updateCourse(createCourseDto, id);
        return 0;
      } catch (error) {
        console.error(error);
        throw new Error('An error occurred while updating the course.');
      }
    }
    @Get('/coursesPresentation')
    async coursesPresentation(@Cookies('id') id: string) {
      try {
        const myCourses: ICourses[] =
          await this._courseService.getCoursComponent(id);
        const courses = await Promise.all(
          myCourses.map(async (course: ICourses) => {
            const professorData =
              await this._courseService.findCourseWithProfessor(course._id);
            const encryptedText = await this._courseService.encryptText(
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
          await this._courseService.getMyCoursComponent(id);
        const courses = await Promise.all(
          myCourses.map(async (course: ICourses) => {
            const professorData =
              await this._courseService.findCourseWithProfessor(course._id);
            const encryptedText = await this._courseService.encryptText(
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
    // @Get('/:coursName')
    // async getCoursName(
    //   @Param('coursName') coursId: string,
    //   @Cookies('id') id: string,
    // ) {
    //   try {
    //     const name = (await this._courseService.getProfessor(id)) as ICourses;
    //     return name.name;
    //   } catch (error) {
    //     console.error(error);
    //     throw new Error('An error occurred while fetching the course name.');
    //   }
    // }
    @Get('/:coursName/fullCours')
    async getFullCours(@Param('coursName') coursId: string) {
      try {
        return await this._courseService.takeCoursByName(coursId);
      } catch (error) {
        console.error(error);
        throw new Error('An error occurred while fetching the full course.');
      }
    }
    @Get('/:coursName/:id/get/cours')
    async getCours(
      @Param('coursName') coursName: string,
      @Param('id') id: string,
    ) {
      try {
        const name = await this._courseService.getOneCourseByCondition({
          name: coursName,
        });
        return name.courses[id];
      } catch (error) {
        console.error(error);
        throw new Error('An error occurred while fetching the course.');
      }
    }
    @Post('/delete/professor/courses')
    @UseGuards(AdminGuard)
    async getProfessorCoursesAndDelete(@Body() body: { email: string }) {
      try {
        const professor = await this._courseService.getProfessorByEmail(
          body.email,
        );
        const courses = professor.coursesId;
        const id = await this._courseService.encryptProfessorJwt(professor);
        for (const course of courses) {
          const cours = await this._courseService.takeCours(course);
          await this._courseService.deleteCourse(cours.name, id.access_token);
        }
      } catch (error) {}
    }
    @Post('/add/students/to/couses')
    async addStudentToCourse(
      @Body() body: { studentsEmail: string[]; courseName: string },
      @Cookies('id') id: string,
    ) {
      try {
        await this._courseService.addStudentsToCourses(
          id,
          body.studentsEmail,
          body.courseName,
        );
        return 0;
      } catch (error) {
        console.error(error);
        throw new Error(
          'An error occurred while adding students to the course.',
        );
      }
    }
  }
  return CRUD;
}
