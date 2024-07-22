import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Cookies } from 'src/Cookie/cookie';
import { ProfessorGuard } from 'src/auth/professor.guard';
import { ICourses } from 'src/Schemas/Entity/ICourses';
import { EmptyClass } from '../Abstact/Profile/Profile.controller';
import { CoursesCrudController } from './courses_crud/courses.crud.controller';
import { CoursesCrudProfessorController } from './courses_professor/courses.professor.controller';
@Controller('courses')
export class CoursesController extends CoursesCrudController(
  CoursesCrudProfessorController(EmptyClass),
) {
  _courseService: CoursesService;
  constructor(private courseService: CoursesService) {
    super();
    this._courseService = courseService;
  }

  @Get('/:coursName/get/course/name/preview')
  async getCoursFullCourse(@Param('coursName') coursName: string) {
    try {
      const name = await this.courseService.getOneCourseByCondition({
        name: coursName,
      });
      return name.courses.map((cours: any) => {
        return { title: cours.title, format: cours.format };
      });
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
}
