import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CursDto } from 'src/Schemas/DTO/curs.dto';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { ProfessorService } from '../professor/professor.service';
import { IProfessor } from 'src/Schemas/Entity/IProfessor';
import {
  HandleProgrammingLanguage,
  IHandleProgrammingLanguage,
} from 'src/Schemas/Compiler/HandleProgrammingLanguage';
import { ICompilatorUser } from 'src/Schemas/Entity/ICompilatorUser';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { createCipheriv, scrypt } from 'crypto';
import { promisify } from 'util';
import { createDecipheriv } from 'crypto';
@Injectable()
export class CursService {
  @Inject(ProfessorService)
  private readonly professorService: ProfessorService;
  constructor(@InjectModel('Curs') private cursModel: Model<ICurs>) {}
  async takeCoursId(cursName: string): Promise<Types.ObjectId> {
    return (await this.cursModel.findOne({ name: cursName }))._id;
  }
  async updateCourse(createCursDto: any, id: any) {
    const { cursBody } = createCursDto;
    const professorCourses: ICurs[] = await this.fetchProfessorCourses(id);
    for (const c of professorCourses) {
      if (c.name === cursBody.oldCoursName) {
        const course = await this.cursModel.findById(c._id);
        course.name =
          cursBody.name !== '' && cursBody.name !== c.name
            ? cursBody.name
            : c.name;
        course.vizibility =
          cursBody.vizibility !== c.vizibility
            ? cursBody.vizibility
            : c.vizibility;
        course.description =
          cursBody.description !== '' && cursBody.description !== c.description
            ? cursBody.description
            : c.description;
        await course.save();
      }
    }
  }
  async getVideoPathFromCourse(
    professorId: string,
    courseName: string,
    videoTitle: string,
  ) {
    const professorCourses: ICurs[] =
      await this.fetchProfessorCourses(professorId);
    let videoPath: string = '';
    for (const course of professorCourses) {
      if (course.name === courseName) {
        for (const component of course.curs) {
          if (component.format === 'Video') {
            const videoComponent = component as IVideo;
            if (videoComponent.title === videoTitle) {
              videoPath = videoComponent.videoPath;
            }
          }
        }
      }
    }
    return videoPath;
  }
  async updateVideoFromCourse(
    video: IVideo,
    videoTitle: string,
    professorId: string,
    courseName: string,
  ) {
    const professorCourses: ICurs[] =
      await this.fetchProfessorCourses(professorId);
    for (const course of professorCourses) {
      if (course.name === courseName) {
        for (const component of course.curs) {
          if (component.format === 'Video') {
            const videoComponent = component as IVideo;
            if (videoComponent.title === videoTitle) {
              videoComponent.title =
                videoComponent.title !== video.title &&
                videoComponent.title !== ''
                  ? video.title
                  : videoComponent.title;
              videoComponent.descrition =
                videoComponent.descrition !== videoTitle &&
                videoComponent.descrition !== ''
                  ? videoComponent.descrition
                  : video.descrition;
              videoComponent.videoPath =
                videoComponent.videoPath !== videoTitle &&
                videoComponent.videoPath !== ''
                  ? videoComponent.videoPath
                  : video.videoPath;
              const c = await new this.cursModel(course);
              await c.save();
            }
          }
        }
      }
    }
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
  async addStudent(id: string, professor: string, coursName: string) {
    await this.addCoursFromProfessor(
      professor,
      coursName,
      await this.professorService.decriptJwt(id),
    );

    //this.professorService.addStudentToCours(id, professor, coursName);
  }
  async findCoursFromProfessorEmail(email: string, coursName: string) {
    const decryptedEmail = await this.decryptText(email);
    const professor =
      await this.professorService.getProfessorByEmail(decryptedEmail);
    for (const c of professor) {
      if (c.toString() === (await this.takeCoursId(coursName)).toString()) {
        return true;
      }
    }
    return false;
  }
  async findCoursFromProfessorId(id: string, coursName: string) {
    const professor = await this.professorService.getProfessorById(id);
    for (const c of professor.coursesId) {
      if (c.toString() === (await this.takeCoursId(coursName)).toString()) {
        return await this.takeCours(c);
      }
    }
  }
  async decomprimStudent(id: string) {
    return await this.professorService.decriptJwt(id);
  }
  async addProfessorToCourses(
    professorId: string,
    professor: string[],
    courseName,
  ) {
    const professorCourses: ICurs[] =
      await this.fetchProfessorVisibleCourses(professorId);
    for (const s of professor) {
      for (const courses of professorCourses) {
        if (courseName === courses.name) {
          const c: ICurs = await this.findCoursFromProfessorId(
            professorId,
            courses.name,
          );
          c.colaborationId.push(
            (await this.professorService.getProfessorById(s))._id,
          );
          const newCurs = await new this.cursModel(c);
          newCurs.save();
        }
      }
    }
  }

  async addStudentsToCourses(
    professorId: string,
    student: string[],
    courseName,
  ) {
    const professorCourses: ICurs[] =
      await this.fetchProfessorVisibleCourses(professorId);
    const s = Promise.all(await this.professorService.getStudentsId(student));
    for (const stud of await s) {
      for (const courses of professorCourses) {
        if (courseName === courses.name) {
          const c: ICurs = await this.findCoursFromProfessorId(
            professorId,
            courses.name,
          );
          c.studentId.push(stud);
          const newCurs = await new this.cursModel(c);
          newCurs.save();
        }
      }
    }
  }

  async isStudentInCours(email: string, coursName: string, id: string) {
    const decryptedEmail = await this.decryptText(email);
    const professor =
      await this.professorService.getProfessorByEmail(decryptedEmail);
    for (const c of professor) {
      const cours = await this.takeCoursId(coursName);
      if (c.toString() === cours.toString()) {
        const cs = await this.takeCours(cours);
        const i = await this.decomprimStudent(id);
        return cs.studentId.map((id) => id.toString()).includes(i);
      }
    }
  }
  async addCoursFromProfessor(
    email: string,
    coursName: string,
    student: string,
  ) {
    const decryptedEmail = await this.decryptText(email);
    const professor =
      await this.professorService.getProfessorByEmail(decryptedEmail);
    for (const c of professor) {
      const cours = await this.takeCoursId(coursName);
      if (c.toString() === cours.toString()) {
        const cs = await this.takeCours(cours);
        cs.studentId.push(new Types.ObjectId(student));
        const newCurs = await new this.cursModel(cs);
        newCurs.save();
      }
    }
  }
  async getCoursFromProfessor(email: string, coursName: string, id: string) {
    const decryptedEmail = await this.decryptText(email);
    const professor =
      await this.professorService.getProfessorByEmail(decryptedEmail);
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
  async addMediaFormat(
    cursId: Types.ObjectId,
    media: IVideo | IDocumentFormat | ICompilators,
  ) {
    const curs: ICurs = await this.cursModel.findById(cursId);
    curs.curs.push(media);
    curs.save();
    return curs.curs.length - 1;
  }

  async fetchProfessorVisibleCourses(id: string): Promise<ICurs[]> {
    const professorCoursId: IProfessor =
      await this.professorService.getProfessorById(id);

    const courses: ICurs[] = [];
    if (professorCoursId !== null) {
      for (const c of professorCoursId.coursesId) {
        const cours: ICurs = await this.cursModel.findById(c);
        if (cours?.vizibility === true) {
          courses.push(cours);
        }
      }
    }
    return courses;
  }
  async getProfessorVideos(id: string, courseName: string): Promise<IVideo[]> {
    const professorCourses: ICurs[] = await this.fetchProfessorCourses(id);
    const videos: IVideo[] = [];
    for (const course of professorCourses) {
      if (course.name === courseName) {
        for (const component of course.curs) {
          if (component.format === 'Video') {
            const videoComponent = component as IVideo;
            videos.push(videoComponent);
          }
        }
      }
    }
    return videos;
  }

  async fetchProfessorCourses(id: string): Promise<ICurs[]> {
    const professorCoursId: IProfessor =
      await this.professorService.getProfessorById(id);

    const courses: ICurs[] = [];
    if (professorCoursId !== null) {
      for (const c of professorCoursId.coursesId) {
        const cours: ICurs = await this.cursModel.findById(c);
        courses.push(cours);
      }
    }
    return courses;
  }

  async getCoursComponent(): Promise<ICurs[]> {
    const professorCoursId: Set<Types.ObjectId> =
      await this.professorService.getAllProfessorsCursId();

    const courses: ICurs[] = [];
    for (const c of professorCoursId) {
      const cours: ICurs = await this.cursModel.findById(c);
      if (cours?.vizibility === true) {
        courses.push(cours);
      }
    }
    return courses;
  }

  async createNewCourse(curse: CursDto, professorId: string) {
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
  async chooseCompiler(userData: ICompilatorUser) {
    const handleProgrammingLanguage: IHandleProgrammingLanguage =
      new HandleProgrammingLanguage(userData);
    return handleProgrammingLanguage.chooseLanguage();
  }
  async executeScripts(userData: ICompilatorUser, input: string) {
    const handleProgrammingLanguage: IHandleProgrammingLanguage =
      new HandleProgrammingLanguage(userData);
    handleProgrammingLanguage.setInputOutputs(input);
    return handleProgrammingLanguage.executeScripts();
  }
}
