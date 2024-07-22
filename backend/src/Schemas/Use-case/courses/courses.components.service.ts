import { Constructor } from 'EnviormentVariable';
import { Model } from 'mongoose';
import { ICourses } from 'src/Schemas/Entity/ICourses';
import { ProfessorService } from '../professor/professor.service';

export function CoursesComponents<TBase extends Constructor>(Base: TBase) {
  abstract class CoursesComponentService extends Base {
    abstract _coursesModel: Model<ICourses>;
    abstract _professorService: ProfessorService;

    async getCoursComponent(id: string): Promise<ICourses[]> {
      try {
        const professorCoursId = await this._coursesModel.find();
        const courses: ICourses[] = [];
        for (const c of professorCoursId) {
          if (id === 'undefined') {
            if (c?.vizibility === true) {
              courses.push(c);
            }
          } else {
            try {
              const entityId = await this._professorService.decriptJwt(id);
              let isStudent: boolean = false;
              for (const s of c.studentId) {
                if (s.toString() === entityId) {
                  isStudent = true;
                  break;
                }
              }
              let isColaborator: boolean = false;
              for (const col of c.colaborationId) {
                if (col.toString() === entityId) {
                  isColaborator = true;
                  break;
                }
              }
              if (isStudent || isColaborator) {
                courses.push(c);
              } else if (c?.vizibility === true) {
                courses.push(c);
              } else {
                const professor = await this._professorService.getProfessor(id);
                professor.coursesId.forEach((p) => {
                  if (p.toString() === c._id.toString()) {
                    courses.push(c);
                  }
                });
              }
            } catch (error) {}
          }
        }
        return courses;
      } catch (error) {
        throw new Error(`Error while getting course component: ${error}`);
      }
    }
    async getMyCoursComponent(id: string): Promise<ICourses[]> {
      try {
        const professorCoursId = await this._coursesModel.find();
        const courses: ICourses[] = [];
        for (const c of professorCoursId) {
          if (id === 'undefined') {
            if (c?.vizibility === true) {
              courses.push(c);
            }
          } else {
            try {
              const entityId = await this._professorService.decriptJwt(id);
              let isStudent: boolean = false;
              for (const s of c.studentId) {
                if (s.toString() === entityId) {
                  isStudent = true;
                  break;
                }
              }
              let isColaborator: boolean = false;
              for (const col of c.colaborationId) {
                if (col.toString() === entityId) {
                  isColaborator = true;
                  break;
                }
              }
              if (isStudent || isColaborator) {
                courses.push(c);
              } else {
                const professor = await this._professorService.getProfessor(id);
                professor.coursesId.forEach((p) => {
                  if (p.toString() === c._id.toString()) {
                    courses.push(c);
                  }
                });
              }
            } catch (error) {}
          }
        }
        return courses;
      } catch (error) {
        throw new Error(`Error while getting course component: ${error}`);
      }
    }
  }
  return CoursesComponentService;
}
