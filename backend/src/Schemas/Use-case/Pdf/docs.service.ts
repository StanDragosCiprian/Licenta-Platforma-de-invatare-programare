import { Inject, Injectable } from '@nestjs/common';
import { ProfessorService } from '../professor/professor.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { DocsHandle } from '../HandleControllersEntity/DocsHandle';
import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';

@Injectable()
export class DocsService {
  @Inject(ProfessorService)
  private readonly professorService: ProfessorService;
  constructor(@InjectModel('Curs') private docsModel: Model<ICurs>) {}
  private docsHandle = new DocsHandle();
  async takeCoursId(cursName: string): Promise<Types.ObjectId> {
    return (await this.docsModel.findOne({ name: cursName }))._id;
  }
  async getPdfPathFromCourse(
    professorId: string,
    courseName: string,
    videoTitle: string,
  ) {
    this.docsHandle.setProfessorService(this.professorService);
    return await this.docsHandle.getPdfPathFromCourse(
      professorId,
      courseName,
      videoTitle,
      this.docsModel,
    );
  }
  async getProfessorMedia(
    id: string,
    courseName: string,
  ): Promise<IDocumentFormat[]> {
    this.docsHandle.setProfessorService(this.professorService);
    return await this.docsHandle.getProfessorPdf(
      id,
      courseName,
      this.docsModel,
    );
  }
  async addMediaFormat(cursId: Types.ObjectId, media: IDocumentFormat) {
    const curs: ICurs = await this.docsModel.findById(cursId);
    curs.curs.push(media);
    curs.save();
    return curs.curs.length - 1;
  }
  async updatePdfFromCourse(
    newPdf: IDocumentFormat,
    pdfTitle: string,
    professorId: string,
    courseName: string,
  ) {
    this.docsHandle.setProfessorService(this.professorService);
    await this.docsHandle.updatePdfFromCourse(
      newPdf,
      pdfTitle,
      professorId,
      courseName,
      this.docsModel,
    );
  }
}
