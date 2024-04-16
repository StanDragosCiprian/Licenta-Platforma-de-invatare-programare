import { Model } from 'mongoose';
import { ProfessorService } from '../professor/professor.service';
import { ProfessorHandle } from './ProfessorHandle';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';
import { ICompilators } from 'src/Schemas/Entity/ICompilators';
import { ICourses } from 'src/Schemas/Entity/ICourses';
export interface IVideoHandle {
  getProfessorVide(
    id: string,
    courseName: string,
    videoModel: Model<any>,
  ): Promise<IVideo[]>;
  setProfessorService(professorService: ProfessorService): void;
  getVideoPathFromCourse(
    professorId: string,
    courseName: string,
    videoTitle: string,
    model: Model<any>,
  ): Promise<string>;
  updateVideoFromCourse(
    video: IVideo,
    videoTitle: string,
    professorId: string,
    courseName: string,
    model: Model<any>,
  ): Promise<void>;
}
export class VideoHandle extends ProfessorHandle implements IVideoHandle {
  constructor() {
    super();
  }
  async updateVideoFromCourse(
    video: IVideo,
    videoTitle: string,
    professorId: string,
    courseName: string,
    model: Model<any>,
  ): Promise<void> {
    await this.iterateToProfessorCourses(
      professorId,
      courseName,
      'Video',
      model,
      async (
        component: IVideo | IDocumentFormat | ICompilators,
        course: ICourses,
      ) => {
        if (component.format === 'Video') {
          const videoComponent = component as IVideo;
          if (videoComponent.title === videoTitle) {
            videoComponent.title = this.assignProperty(
              videoComponent,
              video,
              'title',
            );
            videoComponent.videoPath = this.assignProperty(
              videoComponent,
              video,
              'videoPath',
            );
            videoComponent.description = this.assignProperty(
              videoComponent,
              video,
              'description',
            );
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
  async getVideoPathFromCourse(
    professorId: string,
    courseName: string,
    videoTitle: string,
    model: Model<any>,
  ) {
    let videoPath: string = '';
    await this.iterateToProfessorCourses(
      professorId,
      courseName,
      'Video',
      model,
      (component: IVideo | IDocumentFormat | ICompilators) => {
        if (component.title === videoTitle) {
          if (component.format === 'Video') {
            const videoComponent = component as IVideo;
            videoPath = videoComponent.videoPath;
          }
        }
      },
    );
    return videoPath;
  }
  async getProfessorVide(
    professorId: string,
    courseName: string,
    model: Model<any>,
  ): Promise<IVideo[]> {
    const videos: IVideo[] = [];
    await this.iterateToProfessorCourses(
      professorId,
      courseName,
      'Video',
      model,
      (component: IVideo | IDocumentFormat | ICompilators) => {
        if (component.format === 'Video') {
          const videoComponent = component as IVideo;
          videos.push(videoComponent);
        }
      },
    );
    return videos;
  }
}
