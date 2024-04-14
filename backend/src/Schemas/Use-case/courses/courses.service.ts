import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CoursesDto } from 'src/Schemas/DTO/courses.dto';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { ProfessorService } from '../professor/professor.service';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';
import { FILELOCATION } from 'EnviormentVariable';
import * as fs from 'fs';
import { ProfessorHandle } from '../HandleControllersEntity/ProfessorHandle';
import { CoursesHandle } from '../HandleControllersEntity/CoursesHandle';
@Injectable()
export class CursService {
  @Inject(ProfessorService)
  private readonly professorService: ProfessorService;
  constructor(@InjectModel('Courses') private cursModel: Model<ICurs>) {}
  async takeCoursId(cursName: string): Promise<Types.ObjectId> {
    try {
      const curs = await this.cursModel.findOne({ name: cursName });
      if (curs) {
        return curs._id;
      } else {
        throw new Error(`Course with name ${cursName} not found`);
      }
    } catch (error) {
      throw new Error(`Error while fetching course ID: ${error}`);
    }
  }
  private professorHandle = new ProfessorHandle();
  public async renameFile(
    oldName: string,
    newCurs: string,
    courseId: Types.ObjectId[],
  ) {
    try {
      fs.renameSync(
        `${FILELOCATION}\\backend\\src\\VideoTutorial\\${oldName}`,
        `${FILELOCATION}\\backend\\src\\VideoTutorial\\${newCurs}`,
      );
      const courseHandle = new CoursesHandle();
      courseHandle.setCourseModel(this.cursModel);
      await courseHandle.changeDirectoryfromCourse(courseId, oldName, newCurs);
    } catch (error) {
      throw new Error(`Error while renaming file: ${error}`);
    }
  }

  async updateCourse(createCursDto: any, id: any) {
    try {
      const { cursBody } = createCursDto;
      const professorCourses: ICurs[] = await this.fetchProfessorCourses(id);
      const courseHandle = new CoursesHandle();
      courseHandle.setCourseModel(this.cursModel);
      await courseHandle.updateCourse(cursBody, professorCourses);
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
      courseHandle.setCourseModel(this.cursModel);
      let course: ICurs;
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

  async takeCours(cursId: Types.ObjectId): Promise<ICurs> {
    try {
      return await this.cursModel.findOne({ _id: cursId });
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
    this.cursModel.watch().on('change', (change) => {
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
        this.cursModel,
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
        this.cursModel,
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
        this.cursModel,
        (c: ICurs) => {
          const newCurs = new this.cursModel(c);
          newCurs.save();
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
        this.cursModel,
        (course: ICurs) => {
          const newCurs = new this.cursModel(course);
          newCurs.save();
        },
      );
    } catch (error) {
      throw new Error(`Error while adding students to courses: ${error}`);
    }
  }

  async getCourseByName(courseName: string) {
    try {
      return await this.cursModel.findOne({ name: courseName });
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
        this.cursModel,
        async (c: ICurs) => {
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
        this.cursModel,
        async (c: ICurs) => {
          c.studentId.push(new Types.ObjectId(student));
          const newCurs = await new this.cursModel(c);
          newCurs.save();
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
          return (await this.takeCours(cours)).curs[id];
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
  async fetchProfessorVisibleCourses(id: string): Promise<ICurs[]> {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      return await this.professorHandle.fetchProfessorVisibleCourses(
        id,
        this.cursModel,
      );
    } catch (error) {
      throw new Error(
        `Error while fetching professor visible courses: ${error}`,
      );
    }
  }
  async fetchProfessorCourses(id: string): Promise<ICurs[]> {
    try {
      this.professorHandle.setProfessorService(this.professorService);
      return await this.professorHandle.fetchProfessorCourses(
        id,
        this.cursModel,
      );
    } catch (error) {
      throw new Error(`Error while fetching professor courses: ${error}`);
    }
  }

  async getCoursComponent(id: string): Promise<ICurs[]> {
    try {
      const professorCoursId = await this.cursModel.find();
      const courses: ICurs[] = [];
      for (const c of professorCoursId) {
        if (id === 'undefined') {
          if (c?.vizibility === true) {
            courses.push(c);
          }
        } else {
          try {
            const isStudent = c.studentId.some(
              async (student: any) =>
                student.toString() ===
                (await this.professorService.decriptJwt(id)),
            );
            const isColaborator = c.colaborationId.some(
              async (student: any) =>
                student.toString() ===
                (await this.professorService.decriptJwt(id)),
            );
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

  async createNewCourse(curse: CoursesDto, professorId: string) {
    try {
      const newCurs = await new this.cursModel(curse);
      newCurs.save();
      const decryptId = await this.professorService.decriptJwt(professorId);
      const professor = await this.professorService.getProfessor(decryptId);
      professor.coursesId.push(newCurs._id);
      professor.save();
      return newCurs.name;
    } catch (error) {
      throw new Error(`Error while creating new course: ${error}`);
    }
  }

  async takeName(cursId: string): Promise<string> {
    try {
      const name = await this.cursModel.findById(cursId);
      return name.name;
    } catch (error) {
      throw new Error(`Error while taking course name: ${error}`);
    }
  }

  async takeCoursByName(
    cursName: string,
  ): Promise<{ title: string; description: string }> {
    try {
      const name = await this.cursModel.findOne({ name: cursName });
      return { title: name.name, description: name.description };
    } catch (error) {
      throw new Error(`Error while taking course by name: ${error}`);
    }
  }

  async takeColaboratoryByCourseName(
    cursName: string,
  ): Promise<Types.ObjectId[]> {
    try {
      const name = await this.cursModel.findOne({ name: cursName });
      return name.colaborationId;
    } catch (error) {
      throw new Error(
        `Error while taking colaboratory by course name: ${error}`,
      );
    }
  }

  async takeFullCurs(cursId: string): Promise<ICurs> {
    try {
      const name = await this.cursModel.findOne({ name: cursId });
      return name;
    } catch (error) {
      throw new Error(`Error while taking full course: ${error}`);
    }
  }

  async changeIndex(
    cursName: string,
    drag: string,
    drop: string,
  ): Promise<void> {
    try {
      const curs = await this.cursModel.findOne({ name: cursName });
      const temp = curs.curs[Number(drag)];
      curs.curs[Number(drag)] = curs.curs[Number(drop)];
      curs.curs[Number(drop)] = temp;
      curs.save();
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
