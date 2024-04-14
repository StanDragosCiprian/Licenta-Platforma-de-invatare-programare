import { Model } from 'mongoose';
import { ProfessorService } from '../professor/professor.service';
import { ProfessorHandle } from './ProfessorHandle';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { CoursesHandle } from './CoursesHandle';

export class CompilatorHandle extends ProfessorHandle {
  constructor() {
    super();
  }
  async getProfessorCompilator(
    id: string,
    courseName: string,
    model: Model<any>,
  ) {
    const compilator: string[] = [];
    await this.iterateToProfessorCourses(
      id,
      courseName,
      'Compilator',
      model,
      (component: IVideo | IDocumentFormat | ICompilators) => {
        const c = component as ICompilators;
        compilator.push(c.title);
      },
    );
    return compilator;
  }
  async updateCompilatorFromCourse(
    compile: ICompilators & { oldTitle: string },
    professorId: string,
    courseName: string,
    model: Model<any>,
  ): Promise<void> {
    await this.iterateToProfessorCourses(
      professorId,
      courseName,
      'Compilator',
      model,
      async (
        component: IVideo | IDocumentFormat | ICompilators,
        course: ICurs,
      ) => {
        if (component.format === 'Compilator') {
          const compileComponent = component as ICompilators;
          if (compileComponent.title === compile.oldTitle) {
            compileComponent.title = this.assignProperty(
              compileComponent,
              compile,
              'title',
            );
            compileComponent.problemRequire = this.assignProperty(
              compileComponent,
              compile,
              'problemRequire',
            );
            compileComponent.problemParameter = this.assignProperty(
              compileComponent,
              compile,
              'problemParameter',
            );
            compileComponent.problemOutputs = this.arrayAssignProperty(
              compileComponent,
              compile,
              'problemOutputs',
            );
            compileComponent.problemInputs = this.arrayAssignProperty(
              compileComponent,
              compile,
              'problemInputs',
            );
            compileComponent.funtionProblemModel = this.assignProperty(
              compileComponent,
              compile,
              'funtionProblemModel',
            );
            compileComponent.problemExemples =
              !this.arraysEqual(compile.problemExemples, ['Input:\nOutput:']) &&
              !this.arraysEqual(
                compile.problemExemples,
                compileComponent.problemExemples,
              )
                ? compile.problemExemples
                : compileComponent.problemExemples;
            const c = await new model(course);
            await c.save();
          }
        }
      },
    );
  }
  setProfessorService(professorService: ProfessorService) {
    this.professorService = professorService;
  }
  async getCoursFromProfessor(
    email: string,
    coursName: string,
    id: string,
    courseHandle: CoursesHandle,
    professorService: ProfessorService,
  ) {
    this.professorService = professorService;
    const decryptedEmail = await this.decryptText(email);
    const professor =
      await this.professorService.getCoursesFromProfessorByEmail(
        decryptedEmail,
      );
    for (const c of professor) {
      const cours = await courseHandle.takeCoursId(coursName);
      if (c.toString() === cours.toString()) {
        return (await courseHandle.takeCours(cours)).curs[id];
      }
    }
    return false;
  }
}
