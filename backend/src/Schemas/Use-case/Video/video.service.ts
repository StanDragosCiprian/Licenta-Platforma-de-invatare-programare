import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { ICurs } from 'src/Schemas/Entity/ICurs';
import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { ProfessorService } from '../professor/professor.service';
import {
  IVideoHandle,
  VideoHandle,
} from '../HandleControllersEntity/VideoHandle';

@Injectable()
export class VideoServices {
  @Inject(ProfessorService)
  private readonly professorService: ProfessorService;
  constructor(@InjectModel('Curs') private videoModel: Model<ICurs>) {}
  private videoHandle: IVideoHandle = new VideoHandle();
  async takeFullCurs(cursId: string): Promise<ICurs> {
    const name = await this.videoModel.findOne({ name: cursId });
    return name;
  }
  async takeCoursId(cursName: string): Promise<Types.ObjectId> {
    return (await this.videoModel.findOne({ name: cursName }))._id;
  }
  async addMediaFormat(
    cursId: Types.ObjectId,
    media: IVideo | IDocumentFormat | ICompilators,
  ) {
    const curs: ICurs = await this.videoModel.findById(cursId);
    curs.curs.push(media);
    curs.save();
    return curs.curs.length - 1;
  }
  async getProfessorMedia(id: string, courseName: string): Promise<IVideo[]> {
    this.videoHandle.setProfessorService(this.professorService);
    return await this.videoHandle.getProfessorVide(
      id,
      courseName,
      this.videoModel,
    );
  }

  async getVideoPathFromCourse(
    professorId: string,
    courseName: string,
    videoTitle: string,
  ) {
    this.videoHandle.setProfessorService(this.professorService);
    return await this.videoHandle.getVideoPathFromCourse(
      professorId,
      courseName,
      videoTitle,
      this.videoModel,
    );
  }
  async updateVideoFromCourse(
    video: IVideo,
    videoTitle: string,
    professorId: string,
    courseName: string,
  ) {
    this.videoHandle.setProfessorService(this.professorService);
    await this.videoHandle.updateVideoFromCourse(
      video,
      videoTitle,
      professorId,
      courseName,
      this.videoModel,
    );
  }
}
