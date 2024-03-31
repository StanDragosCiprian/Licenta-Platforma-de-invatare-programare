import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { CompilatorHandle } from '../HandleControllersEntity/CompilatorHandle';
import { ProfessorService } from '../professor/professor.service';
import { CoursesHandle } from '../HandleControllersEntity/CoursesHandle';
import {
  HandleProgrammingLanguage,
  IHandleProgrammingLanguage,
} from 'src/Schemas/Compiler/HandleProgrammingLanguage';
import { ICompilatorUser } from 'src/Schemas/Entity/ICompilatorUser';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';

@Injectable()
export class CompilatorService {
  @Inject(ProfessorService)
  private readonly professorService: ProfessorService;
  constructor(@InjectModel('Curs') private compilerModel: Model<ICurs>) {}
  private compilatorHandle = new CompilatorHandle();
  async getProfessorCompilator(
    id: string,
    courseName: string,
  ): Promise<string[]> {
    this.compilatorHandle.setProfessorService(this.professorService);
    return await this.compilatorHandle.getProfessorCompilator(
      id,
      courseName,
      this.compilerModel,
    );
  }
  async updateCompilatorFromCourse(
    compile: any,
    professorId: string,
    courseName: string,
  ): Promise<void> {
    this.compilatorHandle.setProfessorService(this.professorService);
    await this.compilatorHandle.updateCompilatorFromCourse(
      compile,
      professorId,
      courseName,
      this.compilerModel,
    );
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
  async addMediaFormat(
    cursId: Types.ObjectId,
    media: IVideo | IDocumentFormat | ICompilators,
  ) {
    const curs: ICurs = await this.compilerModel.findById(cursId);
    curs.curs.push(media);
    curs.save();
    return curs.curs.length - 1;
  }
  async getCoursFromProfessor(
    professor: string,
    coursName: string,
    id: string,
  ) {
    const courseHandle = new CoursesHandle();
    courseHandle.setCourseModel(this.compilerModel);
    return await this.compilatorHandle.getCoursFromProfessor(
      professor,
      coursName,
      id,
      courseHandle,
      this.professorService,
    );
  }
  takeCoursId(coursName: string) {
    const courseId = new CoursesHandle();
    courseId.setCourseModel(this.compilerModel);
    return courseId.takeCoursId(coursName);
  }
}
