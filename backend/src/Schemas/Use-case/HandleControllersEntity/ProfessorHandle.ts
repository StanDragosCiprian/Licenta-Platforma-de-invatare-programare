import { IProfessor } from 'src/Schemas/Entity/IProfessor';
import { ProfessorService } from '../professor/professor.service';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { Document, Model, Types } from 'mongoose';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { promisify } from 'util';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { CoursesHandle } from './CoursesHandle';
export interface IProfessorHandle {
  setProfessorService(professorService: ProfessorService): void;
  fetchProfessorCourses(id: string, model: Model<any>): Promise<ICurs[]>;
  iterateToProfessorCourses(
    professorId: string,
    courseName: string,
    format: string,
    model: Model<any>,
    callback: (component: IVideo | IDocumentFormat | ICompilators) => void,
  ): Promise<void>;
}
export class ProfessorHandle implements IProfessorHandle {
  protected professorService: ProfessorService;
  constructor() {}
  setProfessorService(professorService: ProfessorService) {
    this.professorService = professorService;
  }
  async fetchProfessorCourses(id: string, modle: Model<any>): Promise<ICurs[]> {
    const professorCoursId: IProfessor =
      await this.professorService.getProfessorById(id);

    const courses: ICurs[] = [];
    if (professorCoursId !== null) {
      for (const c of professorCoursId.coursesId) {
        const cours: ICurs = await modle.findById(c);
        courses.push(cours);
      }
    }
    return courses;
  }
  protected assignProperty(
    mediaComponent: any,
    media: any,
    property: string,
  ): any {
    return media[property] !== '' &&
      media[property] !== mediaComponent[property]
      ? media[property]
      : mediaComponent[property];
  }
  protected arraysEqual(a: any[], b: any[]): boolean {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }
  async decryptText(encryptedText: string) {
    const iv = Buffer.from('abcdefghijklmnop');
    const key = (await promisify(scrypt)(
      'Proffessor email by id',
      'salt',
      32,
    )) as Buffer;
    const decipher = createDecipheriv('aes-256-ctr', key, iv);

    const textToDecrypt = Buffer.from(encryptedText, 'hex'); // or 'base64'
    const decryptedText = Buffer.concat([
      decipher.update(textToDecrypt),
      decipher.final(),
    ]);

    return decryptedText.toString('utf8');
  }
  async encryptText(text: string) {
    const iv = Buffer.from('abcdefghijklmnop');
    const key = (await promisify(scrypt)(
      'Proffessor email by id',
      'salt',
      32,
    )) as Buffer;
    const cipher = createCipheriv('aes-256-ctr', key, iv);

    const textToEncrypt = text;
    const encryptedText = Buffer.concat([
      cipher.update(textToEncrypt, 'utf8'),
      cipher.final(),
    ]);

    return encryptedText.toString('hex'); // or 'base64'
  }
  public async iterateToProfessorCourses(
    professorId: string,
    courseName: string,
    format: string,
    model: Model<any>,
    callback: (
      component: IVideo | IDocumentFormat | ICompilators,
      course: ICurs,
    ) => void,
  ) {
    const professorCourses: ICurs[] = await this.fetchProfessorCourses(
      professorId,
      model,
    );
    for (const course of professorCourses) {
      if (course.name === courseName) {
        for (const component of course.curs) {
          if (component.format === format) {
            callback(component, course);
          }
        }
      }
    }
  }
  async findCoursFromProfessorEmail(
    email: string,
    coursName: string,
    couresModal: Model<any>,
  ) {
    const courseHandle = new CoursesHandle();
    courseHandle.setCourseModel(couresModal);
    const decryptedEmail = await this.decryptText(email);
    const professor =
      await this.professorService.getCoursesFromProfessorByEmail(
        decryptedEmail,
      );
    for (const c of professor) {
      if (
        c.toString() === (await courseHandle.takeCoursId(coursName)).toString()
      ) {
        return true;
      }
    }
    return false;
  }
  async findCoursFromProfessorId(
    id: string,
    coursName: string,
    couresModal: Model<any>,
  ) {
    const courseHandle = new CoursesHandle();
    courseHandle.setCourseModel(couresModal);
    const professor = await this.professorService.getProfessorById(id);
    for (const c of professor.coursesId) {
      if (
        c.toString() === (await courseHandle.takeCoursId(coursName)).toString()
      ) {
        return await courseHandle.takeCours(c);
      }
    }
  }
  async fetchProfessorVisibleCourses(
    id: string,
    courseModel: Model<any>,
  ): Promise<ICurs[]> {
    const professorCoursId: IProfessor =
      await this.professorService.getProfessorById(id);

    const courses: ICurs[] = [];
    if (professorCoursId !== null) {
      for (const c of professorCoursId.coursesId) {
        const cours: ICurs = await courseModel.findById(c);
        if (cours?.vizibility === true) {
          courses.push(cours);
        }
      }
    }
    return courses;
  }
  async addProfessorToCourses(
    professorId: string,
    professor: string[],
    courseName,
    courseModel: Model<any>,
    callback: (course: ICurs) => void,
  ) {
    const professorCourses: ICurs[] = await this.fetchProfessorCourses(
      professorId,
      courseModel,
    );
    for (const s of professor) {
      for (const courses of professorCourses) {
        if (courseName === courses.name) {
          const c: ICurs = await this.findCoursFromProfessorId(
            professorId,
            courses.name,
            courseModel,
          );
          c.colaborationId.push(
            (await this.professorService.getProfessorByEmail(s))._id,
          );
          callback(c);
        }
      }
    }
  }
  async iterateToCourses(
    email: string,
    coursName: string,
    coursModal: Model<any>,
    callback: (course: ICurs) => any, // Change void to any
  ): Promise<any> {
    // Add Promise<any> as return type
    return new Promise(async (resolve, reject) => {
      try {
        const courseHandle = new CoursesHandle();
        courseHandle.setCourseModel(coursModal);
        const decryptedEmail = await this.decryptText(email);
        const professor =
          await this.professorService.getCoursesFromProfessorByEmail(
            decryptedEmail,
          );
        for (const c of professor) {
          const cours = await courseHandle.takeCoursId(coursName);
          if (c.toString() === cours.toString()) {
            const cs = await courseHandle.takeCours(cours);
            const result = callback(cs);
            resolve(result);
          }
        }
        resolve(null);
      } catch (error) {
        reject(error);
      }
    });
  }
  async addStudentsToCourses(
    professorId: string,
    student: string[],
    courseName,
    courseModel: Model<any>,
    callback: (course: ICurs) => void,
  ) {
    const professorCourses: ICurs[] = await this.fetchProfessorCourses(
      professorId,
      courseModel,
    );
    const s = await Promise.all(
      await this.professorService.getStudentsId(student),
    );
    for (const stud of await s) {
      for (const courses of professorCourses) {
        if (courseName === courses.name) {
          const c: ICurs = await this.findCoursFromProfessorId(
            professorId,
            courses.name,
            courseModel,
          );
          c.studentId.push(stud);
          callback(c);
        }
      }
    }
  }
  async verifyProfessor(
    email: string,
    coursName: string,
    id: string,
    getCourseByName: (courseName: string) => Promise<
      // eslint-disable-next-line @typescript-eslint/ban-types
      Document<unknown, {}, ICurs> &
        ICurs &
        Required<{
          _id: Types.ObjectId;
        }>
    >,
  ): Promise<boolean> {
    const decryptedEmail = await this.decryptText(email);
    const professor = await this.professorService.getProfessorById(id);
    if (professor) {
      if (professor.email === decryptedEmail) {
        return true;
      }
    } else {
      // const professorId =
      //   await this.professorService.getProfessorByEmail(email);

      for (const p of await (
        await getCourseByName(coursName)
      ).colaborationId) {
        if (p.toString() === id) {
          return true;
        }
      }
    }
    return false;
  }
}
