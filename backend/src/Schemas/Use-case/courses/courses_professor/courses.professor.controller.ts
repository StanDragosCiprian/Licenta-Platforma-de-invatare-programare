import { Constructor } from 'EnviormentVariable';
import { CoursesService } from '../courses.service';
import { Body, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Cookies } from 'src/Cookie/cookie';
import { ICourses } from 'src/Schemas/Entity/ICourses';
import { Types } from 'mongoose';
import { ProfessorGuard } from 'src/auth/professor.guard';

export function CoursesCrudProfessorController<TBase extends Constructor>(
  Base: TBase,
) {
  abstract class CoursesProfessorEndpoints extends Base {
    abstract _courseService: CoursesService;
    @Get('/professorVerifyCourse/:nameCours')
    async professorVerifyCourse(
      @Cookies('id') id: string,
      @Param('nameCours') nameCours: string,
    ): Promise<boolean> {
      try {
        if (id !== 'undefined') {
          const cours = await this._courseService.fetchProfessorCourses(id);
          const profesessor =
            cours !== null
              ? cours.some((c: ICourses) => c.name == nameCours)
              : false;
          if (!profesessor) {
            const colab = (await this._courseService.getOneCourseByCondition({
              name: nameCours,
            })) as ICourses;
            const colaboratory = colab.colaborationId.some(
              async (c: Types.ObjectId) =>
                c ==
                new Types.ObjectId(
                  await this._courseService.decryptProfessor(id),
                ),
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
    @Get('/:professorId/:coursName/isJoin/cours')
    async isJoin(
      @Param('professorId') professorId: string,
      @Param('coursName') coursName: string,
      @Cookies('id') id: string,
    ) {
      try {
        const user = await this._courseService.isStudentInCours(
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
        this._courseService.addStudent(id.id.value, professorId, coursName);
        return { isUpdate: true };
      } catch (error) {
        console.error(error);
        throw new Error(
          'An error occurred while adding the student to the course.',
        );
      }
    }
    @Get('/professorName')
    @UseGuards(ProfessorGuard)
    async professorName(@Cookies('id') id: string): Promise<string> {
      try {
        return (await this._courseService.getProfessor(id)).username;
      } catch (error) {
        console.error(error);
        throw new Error('An error occurred while fetching the professor name.');
      }
    }
    @Get('/coursesProfessor')
    async coursesProfessor(@Cookies('id') id: string) {
      try {
        const professorCourses: ICourses[] =
          await this._courseService.fetchProfessorVisibleCourses(id);

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
    @Post('/add/professors/to/courses')
    async addProfessorToCourse(
      @Body() body: { studentsEmail: string[]; courseName: string },
      @Cookies('id') id: string,
    ) {
      try {
        await this._courseService.addProfessorToCourses(
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
  }
  return CoursesProfessorEndpoints;
}
