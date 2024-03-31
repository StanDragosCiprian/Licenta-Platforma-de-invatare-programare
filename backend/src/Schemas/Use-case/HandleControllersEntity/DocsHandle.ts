import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';
import { ProfessorHandle } from './ProfessorHandle';
import { Model } from 'mongoose';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { ProfessorService } from '../professor/professor.service';
import { ICurs } from 'src/Schemas/Entity/ICurs';

export class DocsHandle extends ProfessorHandle {
  async updatePdfFromCourse(
    newPdf: IDocumentFormat,
    pdfTitle: string,
    professorId: string,
    courseName: string,
    docsModel: Model<any>,
  ) {
    await this.iterateToProfessorCourses(
      professorId,
      courseName,
      'Pdf',
      docsModel,
      async (
        component: IVideo | IDocumentFormat | ICompilators,
        course: ICurs,
      ) => {
        if (component.format === 'Pdf') {
          const pdfComponent = component as IDocumentFormat;
          if (pdfComponent.title === pdfTitle) {
            pdfComponent.title =
              pdfComponent.title !== '' &&
              pdfComponent.title !== newPdf.title &&
              newPdf.title !== '_'
                ? newPdf.title
                : pdfComponent.title;
            pdfComponent.documentFormatName = this.assignProperty(
              pdfComponent,
              newPdf,
              'documentFormatName',
            );
            const newPdfAdd = await new docsModel(course);
            newPdfAdd.save();
          }
        }
      },
    );
  }
  constructor() {
    super();
  }
  async getPdfPathFromCourse(
    professorId: string,
    courseName: string,
    videoTitle: string,
    model: Model<any>,
  ) {
    let pdfPath: string = '';
    await this.iterateToProfessorCourses(
      professorId,
      courseName,
      'Pdf',
      model,
      (component: IVideo | IDocumentFormat | ICompilators) => {
        if (component.title === videoTitle) {
          if (component.format === 'Pdf') {
            const videoComponent = component as IDocumentFormat;
            pdfPath = videoComponent.documentFormatName;
          }
        }
      },
    );
    return pdfPath;
  }
  async getProfessorPdf(
    professorId: string,
    courseName: string,
    model: Model<any>,
  ): Promise<IDocumentFormat[]> {
    const videos: IDocumentFormat[] = [];
    await this.iterateToProfessorCourses(
      professorId,
      courseName,
      'Pdf',
      model,
      (component: IVideo | IDocumentFormat | ICompilators) => {
        if (component.format === 'Pdf') {
          const videoComponent = component as IDocumentFormat;
          videos.push(videoComponent);
        }
      },
    );
    return videos;
  }
  setProfessorService(professorService: ProfessorService) {
    this.professorService = professorService;
  }
}
