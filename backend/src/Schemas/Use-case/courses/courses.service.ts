import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CoursesDto } from 'src/Schemas/DTO/courses.dto';
import { ICourses } from 'src/Schemas/Entity/ICourses';
import { ProfessorService } from '../professor/professor.service';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';
import { FILELOCATION } from 'EnviormentVariable';
import * as fs from 'fs';
import { ProfessorHandle } from '../HandleControllersEntity/ProfessorHandle';
import { CoursesHandle } from '../HandleControllersEntity/CoursesHandle';
@Injectable()
export class CoursesService {
  @Inject(ProfessorService)
  private readonly professorService: ProfessorService;
  constructor(@InjectModel('Courses') private coursesModel: Model<ICourses>) {}
  async takeCoursId(courseName: string): Promise<Types.ObjectId> {
    try {
      const courseId = await this.coursesModel.findOne({ name: courseName });
      if (courseId) {
        return courseId._id;
      } else {
        throw new Error(`Course with name ${courseName} not found`);
      }
    } catch (error) {
      throw new Error(`Error while fetching course ID: ${error}`);
    }
  }
  private professorHandle = new ProfessorHandle();
  public async renameFile(
    oldName: string,
    newCourse: string,
    courseId: Types.ObjectId[],
  ) {
    try {
      fs.renameSync(
        `${FILELOCATION}\\backend\\src\\VideoTutorial\\${oldName}`,
        `${FILELOCATION}\\backend\\src\\VideoTutorial\\${newCourse}`,
      );
      const courseHandle = new CoursesHandle();
      courseHandle.setCourseModel(this.coursesModel);
      await courseHandle.changeDirectoryfromCourse(
        courseId,
        oldName,
        newCourse,
      );
    } catch (error) {
      throw new Error(`Error while renaming file: ${error}`);
    }
  }

  async updateCourse(createCourseDto: any, id: any) {
    try {
      const { courseBody } = createCourseDto;
      const professorCourses: ICourses[] = await this.fetchProfessorCourses(id);
      const courseHandle = new CoursesHandle();
      courseHandle.setCourseModel(this.coursesModel);
      await courseHandle.updateCourse(courseBody, professorCourses);
    } catch (error) {
      throw new Error(`Error while updating course: ${error}`);
    }
  }

  async deleteCourse(courseName: string, id: string) {
    try {
      const professorCourses: IProfessor =
        await this.professorService.getProfessor(
          await this.professorService.decriptJwt(id),
        );
      const courseHandle = new CoursesHandle();
      courseHandle.setCourseModel(this.coursesModel);
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

  async getProfessorByEmail(email: string): Promise<IProfessor> {
    try {
      return await this.professorService.getProfessorByEmail(email);
    } catch (error) {
      throw new Error(`Error while getting professor by email: ${error}`);
    }
  }

  async takeCours(courseId: Types.ObjectId): Promise<ICourses> {
    try {
      return await this.coursesModel.findOne({ _id: courseId });
    } catch (error) {
      throw new Error(`Error while fetching course: ${error}`);
    }
  }

  async getProfessorNameForCours(id: string): Promise<string> {
    try {
      return this.professorService.getProfessorName(id);
    } catch (error) {
      throw new Error(`Error while getting professor name: ${error}`);
    }
  }

  async getProfessorById(id: string): Promise<Types.ObjectId> {
    try {
      return (await this.professorService.getProfessorById(id))._id;
    } catch (error) {
      throw new Error(`Error while getting professor by ID: ${error}`);
    }
  }
  onModuleInit() {
    this.coursesModel.watch().on('change', (change) => {
      console.log(change);
    });
  }
  async encryptText(text: string) {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      return await this.professorHandle.encryptText(text);
    } catch (error) {
      throw new Error(`Error while encrypting text: ${error}`);
    }
  }
  async encryptProfessorJwt(email: IProfessor) {
    try {
      return await this.professorService.makeJwt(email);
    } catch (error) {
      throw new Error(`Error while encrypting professor JWT: ${error}`);
    }
  }
  async decryptText(encryptedText: string) {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      return await this.professorHandle.decryptText(encryptedText);
    } catch (error) {
      throw new Error(`Error while decrypting text: ${error}`);
    }
  }

  async addStudent(id: string, professor: string, coursName: string) {
    try {
      await this.addCoursFromProfessor(
        professor,
        coursName,
        await this.professorService.decriptJwt(id),
      );
    } catch (error) {
      throw new Error(`Error while adding student: ${error}`);
    }
  }

  async findCoursFromProfessorEmail(email: string, coursName: string) {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      return await this.professorHandle.findCoursFromProfessorEmail(
        email,
        coursName,
        this.coursesModel,
      );
    } catch (error) {
      throw new Error(
        `Error while finding course from professor email: ${error}`,
      );
    }
  }

  async findCoursFromProfessorId(id: string, coursName: string) {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      return await this.professorHandle.findCoursFromProfessorId(
        id,
        coursName,
        this.coursesModel,
      );
    } catch (error) {
      throw new Error(`Error while finding course from professor ID: ${error}`);
    }
  }

  async decomprimStudent(id: string) {
    try {
      return await this.professorService.decriptJwt(id);
    } catch (error) {
      throw new Error(`Error while decompressing student: ${error}`);
    }
  }

  async addProfessorToCourses(
    professorId: string,
    professor: string[],
    courseName: string,
  ) {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      await this.professorHandle.addProfessorToCourses(
        professorId,
        professor,
        courseName,
        this.coursesModel,
        (c: ICourses) => {
          const newCourse = new this.coursesModel(c);
          newCourse.save();
        },
      );
    } catch (error) {
      throw new Error(`Error while adding professor to courses: ${error}`);
    }
  }

  async addStudentsToCourses(
    professorId: string,
    student: string[],
    courseName: string,
  ) {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      await this.professorHandle.addStudentsToCourses(
        professorId,
        student,
        courseName,
        this.coursesModel,
        (course: ICourses) => {
          const newCourse = new this.coursesModel(course);
          newCourse.save();
        },
      );
    } catch (error) {
      throw new Error(`Error while adding students to courses: ${error}`);
    }
  }

  async getCourseByName(courseName: string) {
    try {
      return await this.coursesModel.findOne({ name: courseName });
    } catch (error) {
      throw new Error(`Error while getting course by name: ${error}`);
    }
  }

  async verifyProfessor(
    email: string,
    coursName: string,
    id: string,
  ): Promise<boolean> {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      return await this.professorHandle.verifyProfessor(
        email,
        coursName,
        id,
        this.getCourseByName,
      );
    } catch (error) {
      throw new Error(`Error while verifying professor: ${error}`);
    }
  }

  async isStudentInCours(email: string, coursName: string, id: string) {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      const isStudent = await this.professorHandle.iterateToCourses(
        email,
        coursName,
        this.coursesModel,
        async (c: ICourses) => {
          const i = await this.decomprimStudent(id);
          return c.studentId.some((id) => id.toString() === i);
        },
      );
      return isStudent;
    } catch (error) {
      throw new Error(`Error while checking if student is in course: ${error}`);
    }
  }
  async addCoursFromProfessor(
    email: string,
    coursName: string,
    student: string,
  ) {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      await this.professorHandle.iterateToCourses(
        email,
        coursName,
        this.coursesModel,
        async (c: ICourses) => {
          c.studentId.push(new Types.ObjectId(student));
          const newCourse = await new this.coursesModel(c);
          newCourse.save();
        },
      );
    } catch (error) {
      throw new Error(`Error while adding course from professor: ${error}`);
    }
  }
  async getCoursFromProfessor(email: string, coursName: string, id: string) {
    try {
      const decryptedEmail = await this.decryptText(email);
      const professor =
        await this.professorService.getCoursesFromProfessorByEmail(
          decryptedEmail,
        );
      for (const c of professor) {
        const cours = await this.takeCoursId(coursName);
        if (c.toString() === cours.toString()) {
          return (await this.takeCours(cours)).courses[id];
        }
      }
      return false;
    } catch (error) {
      throw new Error(`Error while getting course from professor: ${error}`);
    }
  }
  async findCourseWithProfessor(courseId: Types.ObjectId): Promise<any> {
    try {
      return await this.professorService.getProfessorByCours(courseId);
    } catch (error) {
      throw new Error(`Error while finding course with professor: ${error}`);
    }
  }
  async fetchProfessorVisibleCourses(id: string): Promise<ICourses[]> {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      return await this.professorHandle.fetchProfessorVisibleCourses(
        id,
        this.coursesModel,
      );
    } catch (error) {
      throw new Error(
        `Error while fetching professor visible courses: ${error}`,
      );
    }
  }
  async fetchProfessorCourses(id: string): Promise<ICourses[]> {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      return await this.professorHandle.fetchProfessorCourses(
        id,
        this.coursesModel,
      );
    } catch (error) {
      throw new Error(`Error while fetching professor courses: ${error}`);
    }
  }

  async getCoursComponent(id: string): Promise<ICourses[]> {
    try {
      const professorCoursId = await this.coursesModel.find();
      const courses: ICourses[] = [];
      for (const c of professorCoursId) {
        if (id === 'undefined') {
          if (c?.vizibility === true) {
            courses.push(c);
          }
        } else {
          try {
            const entityId = await this.professorService.decriptJwt(id);
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
              const professor =
                await this.professorService.getProfessorById(id);
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
      const professorCoursId = await this.coursesModel.find();
      const courses: ICourses[] = [];
      for (const c of professorCoursId) {
        if (id === 'undefined') {
          if (c?.vizibility === true) {
            courses.push(c);
          }
        } else {
          try {
            const entityId = await this.professorService.decriptJwt(id);
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
              const professor =
                await this.professorService.getProfessorById(id);
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
  async createNewCourse(course: CoursesDto, professorId: string) {
    try {
      const newCourse = await new this.coursesModel(course);
      newCourse.save();
      const decryptId = await this.professorService.decriptJwt(professorId);
      const professor = await this.professorService.getProfessor(decryptId);
      professor.coursesId.push(newCourse._id);
      professor.save();
      return newCourse.name;
    } catch (error) {
      throw new Error(`Error while creating new course: ${error}`);
    }
  }

  async takeName(courseId: string): Promise<string> {
    try {
      const name = await this.coursesModel.findById(courseId);
      return name.name;
    } catch (error) {
      throw new Error(`Error while taking course name: ${error}`);
    }
  }

  async takeCoursByName(
    courseName: string,
  ): Promise<{ title: string; description: string }> {
    try {
      const name = await this.coursesModel.findOne({ name: courseName });
      return { title: name.name, description: name.description };
    } catch (error) {
      throw new Error(`Error while taking course by name: ${error}`);
    }
  }

  async takeColaboratoryByCourseName(
    courseName: string,
  ): Promise<Types.ObjectId[]> {
    try {
      const name = await this.coursesModel.findOne({ name: courseName });
      return name.colaborationId;
    } catch (error) {
      throw new Error(
        `Error while taking colaboratory by course name: ${error}`,
      );
    }
  }

  async takeFullCourse(courseId: string): Promise<ICourses> {
    try {
      const name = await this.coursesModel.findOne({ name: courseId });
      return name;
    } catch (error) {
      throw new Error(`Error while taking full course: ${error}`);
    }
  }

  async changeIndex(
    courseName: string,
    drag: string,
    drop: string,
  ): Promise<void> {
    try {
      const courses = await this.coursesModel.findOne({ name: courseName });
      const temp = courses.courses[Number(drag)];
      courses.courses[Number(drag)] = courses.courses[Number(drop)];
      courses.courses[Number(drop)] = temp;
      courses.save();
    } catch (error) {
      throw new Error(`Error while changing index: ${error}`);
    }
  }

  async decryptProfessor(id: string) {
    try {
      return await this.professorService.decriptJwt(id);
    } catch (error) {
      throw new Error(`Error while decrypting professor: ${error}`);
    }
  }
}
