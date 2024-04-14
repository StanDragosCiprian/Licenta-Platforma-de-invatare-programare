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
  constructor(@InjectModel('Courses') private videoModel: Model<ICurs>) {}
  private videoHandle: IVideoHandle = new VideoHandle();
  async takeFullCurs(cursId: string): Promise<ICurs> {
    try {
      const name = await this.videoModel.findOne({ name: cursId });
      return name;
    } catch (error) {
      throw new Error('Failed to retrieve full course');
    }
  }
  async takeCoursId(cursName: string): Promise<Types.ObjectId> {
    try {
      return (await this.videoModel.findOne({ name: cursName }))._id;
    } catch (error) {
      throw new Error('Failed to retrieve course ID');
    }
  }
  async addMediaFormat(
    cursId: Types.ObjectId,
    media: IVideo | IDocumentFormat | ICompilators,
  ) {
    try {
      const curs: ICurs = await this.videoModel.findById(cursId);
      curs.curs.push(media);
      await curs.save();
      return curs.curs.length - 1;
    } catch (error) {
      throw new Error('Failed to add media format');
    }
  }
  async getProfessorMedia(id: string, courseName: string): Promise<IVideo[]> {
    try {
      this.videoHandle.setProfessorService(this.professorService);
      return await this.videoHandle.getProfessorVide(
        id,
        courseName,
        this.videoModel,
      );
    } catch (error) {
      throw new Error('Failed to retrieve professor media');
    }
  }

  async getVideoPathFromCourse(
    professorId: string,
    courseName: string,
    videoTitle: string,
  ) {
    try {
      this.videoHandle.setProfessorService(this.professorService);
      return await this.videoHandle.getVideoPathFromCourse(
        professorId,
        courseName,
        videoTitle,
        this.videoModel,
      );
    } catch (error) {
      throw new Error('Failed to retrieve video path from course');
    }
  }
  async updateVideoFromCourse(
    video: IVideo,
    videoTitle: string,
    professorId: string,
    courseName: string,
  ) {
    try {
      this.videoHandle.setProfessorService(this.professorService);
      await this.videoHandle.updateVideoFromCourse(
        video,
        videoTitle,
        professorId,
        courseName,
        this.videoModel,
      );
    } catch (error) {
      throw new Error('Failed to update video from course');
    }
  }
}
