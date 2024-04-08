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
  constructor(@InjectModel('Curs') private cursModel: Model<ICurs>) {}
  async takeCoursId(cursName: string): Promise<Types.ObjectId> {
    return (await this.cursModel.findOne({ name: cursName }))._id;
  }
  private professorHandle = new ProfessorHandle();
  public async renameFile(
    oldName: string,
    newCurs: string,
    courseId: Types.ObjectId[],
  ) {
    fs.rename(
      `${FILELOCATION}\\backend\\src\\VideoTutorial\\${oldName}`,
      `${FILELOCATION}\\backend\\src\\VideoTutorial\\${newCurs}`,
      (error) => {
        if (error) {
          throw new Error(error.message);
        }
      },
    );
    const courseHandle = new CoursesHandle();
    courseHandle.setCourseModel(this.cursModel);
    await courseHandle.changeDirectoryfromCourse(courseId, oldName, newCurs);
  }
  async updateCourse(createCursDto: any, id: any) {
    const { cursBody } = createCursDto;
    const professorCourses: ICurs[] = await this.fetchProfessorCourses(id);
    const courseHandle = new CoursesHandle();
    courseHandle.setCourseModel(this.cursModel);
    await courseHandle.updateCourse(cursBody, professorCourses);
  }
  async deleteCourse(courseName: string, id: string) {
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
  }
  async getProfessorByEmail(email: string): Promise<IProfessor> {
    return await this.professorService.getProfessorByEmail(email);
  }

  async takeCours(cursId: Types.ObjectId): Promise<ICurs> {
    return await this.cursModel.findOne({ _id: cursId });
  }
  async getProfessorNameForCours(id: string): Promise<string> {
    return this.professorService.getProfessorName(id);
  }
  async getProfessorById(id: string): Promise<Types.ObjectId> {
    return (await this.professorService.getProfessorById(id))._id;
  }
  onModuleInit() {
    this.cursModel.watch().on('change', (change) => {
      console.log(change);
    });
  }
  async encryptText(text: string) {
    this.professorHandle.setProfessorService(this.professorService);
    return await this.professorHandle.encryptText(text);
  }
  async decryptText(encryptedText: string) {
    this.professorHandle.setProfessorService(this.professorService);
    return await this.professorHandle.decryptText(encryptedText);
  }
  async addStudent(id: string, professor: string, coursName: string) {
    await this.addCoursFromProfessor(
      professor,
      coursName,
      await this.professorService.decriptJwt(id),
    );

    //this.professorService.addStudentToCours(id, professor, coursName);
  }
  async findCoursFromProfessorEmail(email: string, coursName: string) {
    this.professorHandle.setProfessorService(this.professorService);
    return await this.professorHandle.findCoursFromProfessorEmail(
      email,
      coursName,
      this.cursModel,
    );
  }
  async findCoursFromProfessorId(id: string, coursName: string) {
    this.professorHandle.setProfessorService(this.professorService);
    return await this.professorHandle.findCoursFromProfessorId(
      id,
      coursName,
      this.cursModel,
    );
  }
  async decomprimStudent(id: string) {
    return await this.professorService.decriptJwt(id);
  }
  async addProfessorToCourses(
    professorId: string,
    professor: string[],
    courseName,
  ) {
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
  }

  async addStudentsToCourses(
    professorId: string,
    student: string[],
    courseName,
  ) {
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
  }
  async getCourseByName(courseName: string) {
    return await this.cursModel.findOne({ name: courseName });
  }
  async verifyProfessor(
    email: string,
    coursName: string,
    id: string,
  ): Promise<boolean> {
    this.professorHandle.setProfessorService(this.professorService);
    return await this.professorHandle.verifyProfessor(
      email,
      coursName,
      id,
      this.getCourseByName,
    );
  }

  async isStudentInCours(email: string, coursName: string, id: string) {
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
  }
  async addCoursFromProfessor(
    email: string,
    coursName: string,
    student: string,
  ) {
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
  }
  async getCoursFromProfessor(email: string, coursName: string, id: string) {
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
  }
  async findCourseWithProfessor(courseId: Types.ObjectId): Promise<any> {
    return await this.professorService.getProfessorByCours(courseId);
  }
  async fetchProfessorVisibleCourses(id: string): Promise<ICurs[]> {
    this.professorHandle.setProfessorService(this.professorService);
    return await this.professorHandle.fetchProfessorVisibleCourses(
      id,
      this.cursModel,
    );
  }
  async fetchProfessorCourses(id: string): Promise<ICurs[]> {
    this.professorHandle.setProfessorService(this.professorService);
    return await this.professorHandle.fetchProfessorCourses(id, this.cursModel);
  }

  async getCoursComponent(id: string): Promise<ICurs[]> {
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
            const professor = await this.professorService.getProfessorById(id);
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
  }

  async createNewCourse(curse: CoursesDto, professorId: string) {
    const newCurs = await new this.cursModel(curse);
    newCurs.save();
    const decryptId = await this.professorService.decriptJwt(professorId);
    const professor = await this.professorService.getProfessor(decryptId);
    professor.coursesId.push(newCurs._id);
    professor.save();
    return newCurs.name;
  }
  async takeName(cursId: string): Promise<string> {
    const name = await this.cursModel.findById(cursId);
    return name.name;
  }
  async takeCoursByName(
    cursName: string,
  ): Promise<{ title: string; description: string }> {
    const name = await this.cursModel.findOne({ name: cursName });
    return { title: name.name, description: name.description };
  }
  async takeColaboratoryByCourseName(
    cursName: string,
  ): Promise<Types.ObjectId[]> {
    const name = await this.cursModel.findOne({ name: cursName });
    return name.colaborationId;
  }
  async takeFullCurs(cursId: string): Promise<ICurs> {
    const name = await this.cursModel.findOne({ name: cursId });
    return name;
  }
  async changeIndex(
    cursName: string,
    drag: string,
    drop: string,
  ): Promise<void> {
    const curs = await this.cursModel.findOne({ name: cursName });
    const temp = curs.curs[Number(drag)];
    curs.curs[Number(drag)] = curs.curs[Number(drop)];
    curs.curs[Number(drop)] = temp;
    curs.save();
  }
  async decryptProfessor(id: string) {
    return await this.professorService.decriptJwt(id);
  }
}
