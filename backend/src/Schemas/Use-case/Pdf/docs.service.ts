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
  constructor(@InjectModel('Courses') private docsModel: Model<ICurs>) {}
  private docsHandle = new DocsHandle();
  async takeCoursId(cursName: string): Promise<Types.ObjectId> {
    try {
      const curs = await this.docsModel.findOne({ name: cursName });
      if (!curs) {
        throw new Error('Course not found');
      }
      return curs._id;
    } catch (error) {
      throw new Error(`Failed to get course ID: ${error}`);
    }
  }

  async getPdfPathFromCourse(
    professorId: string,
    courseName: string,
    videoTitle: string,
  ) {
    try {
      this.docsHandle.setProfessorService(this.professorService);
      return await this.docsHandle.getPdfPathFromCourse(
        professorId,
        courseName,
        videoTitle,
        this.docsModel,
      );
    } catch (error) {
      throw new Error(`Failed to get PDF path from course: ${error}`);
    }
  }

  async getProfessorMedia(
    id: string,
    courseName: string,
  ): Promise<IDocumentFormat[]> {
    try {
      this.docsHandle.setProfessorService(this.professorService);
      return await this.docsHandle.getProfessorPdf(
        id,
        courseName,
        this.docsModel,
      );
    } catch (error) {
      throw new Error(`Failed to get professor media: ${error}`);
    }
  }

  async addMediaFormat(cursId: Types.ObjectId, media: IDocumentFormat) {
    try {
      const curs: ICurs = await this.docsModel.findById(cursId);
      if (!curs) {
        throw new Error('Course not found');
      }
      curs.curs.push(media);
      await curs.save();
      return curs.curs.length - 1;
    } catch (error) {
      throw new Error(`Failed to add media format: ${error}`);
    }
  }

  async updatePdfFromCourse(
    newPdf: IDocumentFormat,
    pdfTitle: string,
    professorId: string,
    courseName: string,
  ) {
    try {
      this.docsHandle.setProfessorService(this.professorService);
      await this.docsHandle.updatePdfFromCourse(
        newPdf,
        pdfTitle,
        professorId,
        courseName,
        this.docsModel,
      );
    } catch (error) {
      throw new Error(`Failed to update PDF from course: ${error}`);
    }
  }
}
