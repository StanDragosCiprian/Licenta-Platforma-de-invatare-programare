import { Constructor } from 'EnviormentVariable';
import { Model, Types } from 'mongoose';
import { ICourses } from 'src/Schemas/Entity/ICourses';
import { ProfessorService } from '../../professor/professor.service';
import { ProfessorHandle } from '../../HandleControllersEntity/ProfessorHandle';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';
const professorHandle = new ProfessorHandle();
export function ProfessorCoursesAdder<TBase extends Constructor>(Base: TBase) {
  abstract class ProfessorCoursesService extends Base {
    abstract _coursesModel: Model<ICourses>;
    abstract _professorService: ProfessorService;

    async addStudent(id: string, professor: string, coursName: string) {
      try {
        await this.addCoursFromProfessorToStudents(
          professor,
          coursName,
          await this._professorService.decriptJwt(id),
        );
      } catch (error) {
        throw new Error(`Error while adding student: ${error}`);
      }
    }
    async addCoursFromProfessorToStudents(
      email: string,
      coursName: string,
      student: string,
    ) {
      try {
        professorHandle.setProfessorService(this._professorService);
        await professorHandle.iterateToCourses(
          email,
          coursName,
          this._coursesModel,
          async (c: ICourses) => {
            c.studentId.push(new Types.ObjectId(student));
            const newCourse = await new this._coursesModel(c);
            newCourse.save();
          },
        );
      } catch (error) {
        throw new Error(`Error while adding course from professor: ${error}`);
      }
    }
    async addStudentsToCourses(
      professorId: string,
      student: string[],
      courseName: string,
    ) {
      try {
        professorHandle.setProfessorService(this._professorService);
        await professorHandle.addStudentsToCourses(
          professorId,
          student,
          courseName,
          this._coursesModel,
          (course: ICourses) => {
            const newCourse = new this._coursesModel(course);
            newCourse.save();
          },
        );
      } catch (error) {
        throw new Error(`Error while adding students to courses: ${error}`);
      }
    }
    async isStudentInCours(email: string, coursName: string, id: string) {
      try {
        professorHandle.setProfessorService(this._professorService);
        const isStudent = await professorHandle.iterateToCourses(
          email,
          coursName,
          this._coursesModel,
          async (c: ICourses) => {
            const i = await this.decomprimStudent(id);
            return c.studentId.some((id) => id.toString() === i);
          },
        );
        return isStudent;
      } catch (error) {
        throw new Error(
          `Error while checking if student is in course: ${error}`,
        );
      }
    }

    async decomprimStudent(id: string) {
      try {
        return await this._professorService.decriptJwt(id);
      } catch (error) {
        throw new Error(`Error while decompressing student: ${error}`);
      }
    }
    async fetchProfessorVisibleCourses(id: string): Promise<ICourses[]> {
      try {
        professorHandle.setProfessorService(this._professorService);
        return await professorHandle.fetchProfessorVisibleCourses(
          id,
          this._coursesModel,
        );
      } catch (error) {
        throw new Error(
          `Error while fetching professor visible courses: ${error}`,
        );
      }
    }
    async getProfessorByEmail(email: string): Promise<IProfessor> {
      try {
        return (await this._professorService.getOneUserByCondition({
          email: email,
        })) as IProfessor;
      } catch (error) {
        throw new Error(`Error while getting professor by email: ${error}`);
      }
    }
    async addProfessorToCourses(
      professorId: string,
      professor: string[],
      courseName: string,
    ) {
      try {
        professorHandle.setProfessorService(this._professorService);
        await professorHandle.addProfessorToCourses(
          professorId,
          professor,
          courseName,
          this._coursesModel,
          (c: ICourses) => {
            const newCourse = new this._coursesModel(c);
            newCourse.save();
          },
        );
      } catch (error) {
        throw new Error(`Error while adding professor to courses: ${error}`);
      }
    }
    async encryptText(text: string) {
      try {
        professorHandle.setProfessorService(this._professorService);
        return await professorHandle.encryptText(text);
      } catch (error) {
        throw new Error(`Error while encrypting text: ${error}`);
      }
    }
    async encryptProfessorJwt(email: IProfessor) {
      try {
        return await this._professorService.makeJwt(email);
      } catch (error) {
        throw new Error(`Error while encrypting professor JWT: ${error}`);
      }
    }
    async decryptText(encryptedText: string) {
      try {
        professorHandle.setProfessorService(this._professorService);
        return await professorHandle.decryptText(encryptedText);
      } catch (error) {
        throw new Error(`Error while decrypting text: ${error}`);
      }
    }
  }

  return ProfessorCoursesService;
}
