import { Constructor } from 'EnviormentVariable';
import { Model, Types } from 'mongoose';
import { ICourses } from 'src/Schemas/Entity/ICourses';
import { ProfessorService } from '../../professor/professor.service';
import { CoursesHandle } from '../../HandleControllersEntity/CoursesHandle';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';
import { ProfessorHandle } from '../../HandleControllersEntity/ProfessorHandle';
import { CoursesDto } from 'src/Schemas/DTO/courses.dto';
const professorHandle = new ProfessorHandle();
export function CoursesCRUD<TBase extends Constructor>(Base: TBase) {
  abstract class CoursesComponentService extends Base {
    abstract _coursesModel: Model<ICourses>;
    abstract _professorService: ProfessorService;
    async takeCoursId(courseName: string): Promise<Types.ObjectId> {
      try {
        const courseId = await this._coursesModel.findOne({ name: courseName });
        if (courseId) {
          return courseId._id;
        } else {
          throw new Error(`Course with name ${courseName} not found`);
        }
      } catch (error) {
        throw new Error(`Error while fetching course ID: ${error}`);
      }
    }

    async updateCourse(createCourseDto: any, id: any) {
      try {
        const { courseBody } = createCourseDto;
        const professorCourses: ICourses[] =
          await this.fetchProfessorCourses(id);
        const courseHandle = new CoursesHandle();
        courseHandle.setCourseModel(this._coursesModel);
        await courseHandle.updateCourse(courseBody, professorCourses);
      } catch (error) {
        throw new Error(`Error while updating course: ${error}`);
      }
    }

    async deleteCourse(courseName: string, id: string) {
      try {
        const professorCourses: IProfessor =
          (await this._professorService.getUserById(
            await this._professorService.decriptJwt(id),
          )) as IProfessor;
        const courseHandle = new CoursesHandle();
        courseHandle.setCourseModel(this._coursesModel);
        let course: ICourses;
        let index: number = 0;
        for (const c of professorCourses.coursesId) {
          const cours = await this.takeCours(c);
          if (cours.name === courseName) {
            professorCourses.coursesId.splice(index, 1);
            course = cours;
            await professorCourses.save();
          }
          index++;
        }
        await courseHandle.deleteCourse(courseName, course);
      } catch (error) {
        throw new Error(`Error while deleting course: ${error}`);
      }
    }

    async takeCours(courseId: Types.ObjectId): Promise<ICourses> {
      try {
        return await this._coursesModel.findOne({ _id: courseId });
      } catch (error) {
        throw new Error(`Error while fetching course: ${error}`);
      }
    }

    onModuleInit() {
      this._coursesModel.watch().on('change', (change) => {
        console.log(change);
      });
    }
    async fetchProfessorCourses(id: string): Promise<ICourses[]> {
      try {
        professorHandle.setProfessorService(this._professorService);
        return await professorHandle.fetchProfessorCourses(
          id,
          this._coursesModel,
        );
      } catch (error) {
        throw new Error(`Error while fetching professor courses: ${error}`);
      }
    }
    async createNewCourse(course: CoursesDto, professorId: string) {
      try {
        const newCourse = await new this._coursesModel(course);
        newCourse.save();
        const decryptId = await this._professorService.decriptJwt(professorId);
        const professor = (await this._professorService.getUserById(
          decryptId,
        )) as IProfessor;
        professor.coursesId.push(newCourse._id);
        professor.save();
        return newCourse.name;
      } catch (error) {
        throw new Error(`Error while creating new course: ${error}`);
      }
    }
    async takeCoursByName(
      courseName: string,
    ): Promise<{ title: string; description: string }> {
      try {
        const name = await this._coursesModel.findOne({ name: courseName });
        return { title: name.name, description: name.description };
      } catch (error) {
        throw new Error(`Error while taking course by name: ${error}`);
      }
    }
    async getOneCourseByCondition(condition: object): Promise<ICourses> {
      try {
        return await this._coursesModel.findOne(condition);
      } catch (error) {
        throw new Error('');
      }
    }
  }
  return CoursesComponentService;
}
