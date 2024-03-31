import { IProfessor } from 'src/Schemas/Entity/IProfessor';
import { ProfessorService } from '../professor/professor.service';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { Model } from 'mongoose';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { promisify } from 'util';
import { createDecipheriv, scrypt } from 'crypto';
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
}
