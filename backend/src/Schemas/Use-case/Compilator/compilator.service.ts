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
  constructor(@InjectModel('Courses') private compilerModel: Model<ICurs>) {}
  private compilatorHandle = new CompilatorHandle();
  async getProfessorCompilator(
    id: string,
    courseName: string,
  ): Promise<string[]> {
    try {
      this.compilatorHandle.setProfessorService(this.professorService);
      return await this.compilatorHandle.getProfessorCompilator(
        id,
        courseName,
        this.compilerModel,
      );
    } catch (error) {
      // Handle the exception here
      console.error(error);
      throw error; // Rethrow the exception if needed
    }
  }
  async updateCompilatorFromCourse(
    compile: any,
    professorId: string,
    courseName: string,
  ): Promise<void> {
    try {
      this.compilatorHandle.setProfessorService(this.professorService);
      await this.compilatorHandle.updateCompilatorFromCourse(
        compile,
        professorId,
        courseName,
        this.compilerModel,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async chooseCompiler(userData: ICompilatorUser) {
    try {
      const handleProgrammingLanguage: IHandleProgrammingLanguage =
        new HandleProgrammingLanguage(userData);
      return handleProgrammingLanguage.chooseLanguage();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async executeScripts(userData: ICompilatorUser, input: string) {
    try {
      const handleProgrammingLanguage: IHandleProgrammingLanguage =
        new HandleProgrammingLanguage(userData);
      handleProgrammingLanguage.setInputOutputs(input);
      return handleProgrammingLanguage.executeScripts();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async addMediaFormat(
    cursId: Types.ObjectId,
    media: IVideo | IDocumentFormat | ICompilators,
  ) {
    try {
      const curs: ICurs = await this.compilerModel.findById(cursId);
      curs.curs.push(media);
      await curs.save();
      return curs.curs.length - 1;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getCoursFromProfessor(
    professor: string,
    coursName: string,
    id: string,
  ) {
    try {
      const courseHandle = new CoursesHandle();
      courseHandle.setCourseModel(this.compilerModel);
      return await this.compilatorHandle.getCoursFromProfessor(
        professor,
        coursName,
        id,
        courseHandle,
        this.professorService,
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  takeCoursId(coursName: string) {
    try {
      const courseId = new CoursesHandle();
      courseId.setCourseModel(this.compilerModel);
      return courseId.takeCoursId(coursName);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
