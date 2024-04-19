import { Model, Types } from 'mongoose';
import { ICourses } from 'src/Schemas/Entity/ICourses';
import { IDocumentFormat } from 'src/Schemas/Entity/IPdf';
import { IVideo } from 'src/Schemas/Entity/IVideo';
import * as fs from 'fs';
import { FILELOCATION } from 'EnviormentVariable';
import * as path from 'path';
export class CoursesHandle {
  private courseModel: Model<any>;
  public setCourseModel(courseModel: Model<any>): void {
    this.courseModel = courseModel;
  }
  async takeCoursId(courseName: string): Promise<Types.ObjectId> {
    return (await this.courseModel.findOne({ name: courseName }))._id;
  }
  async takeCours(courseId: Types.ObjectId): Promise<ICourses> {
    return await this.courseModel.findOne({ _id: courseId });
  }
  async deleteCourse(courseName: string, c: ICourses) {
    if (c.name === courseName) {
      for (const cs of c.courses) {
        if (cs.format === 'Video') {
          const video = cs as IVideo;
          const vid = video.videoPath.replace(/\//g, '\\');
          const filePath = path.resolve(
            `${FILELOCATION}\\backend\\src\\VideoTutorial\\${vid}`,
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          } else {
            throw new Error(`File does not exist: ${filePath}`);
          }
        } else if (cs.format === 'Pdf') {
          const pdf = cs as IDocumentFormat;
          fs.unlinkSync(
            `${FILELOCATION}\\backend\\src\\VideoTutorial\\${pdf.documentFormatName.replace(
              '/',
              '\\',
            )}`,
          );
        }
      }
      await this.courseModel.deleteOne({ _id: c._id });
    }
  }
  async changeDirectoryfromCourse(
    courseId: Types.ObjectId[],
    oldName: string,
    newName: string,
  ) {
    for (const c of courseId) {
      const coursesAll = await this.courseModel.findOne({ _id: c });
      for (const cs of coursesAll.courses) {
        if (cs.format === 'Video') {
          const video = cs as IVideo;
          if (video.videoPath.includes(oldName)) {
            video.videoPath = video.videoPath.replace(oldName, newName);
          }
        } else if (cs.format === 'Pdf') {
          const pdf = cs as IDocumentFormat;
          if (pdf.documentFormatName.includes(oldName)) {
            pdf.documentFormatName = pdf.documentFormatName.replace(
              oldName,
              newName,
            );
          }
        }
      }
      const newCourse = await new this.courseModel(coursesAll);
      await newCourse.save();
    }
  }
  private assignProperty(
    mediaComponent: any,
    media: any,
    property: string,
  ): any {
    return media[property] !== '' &&
      media[property] !== mediaComponent[property]
      ? media[property]
      : mediaComponent[property];
  }
  async updateCourse(courseBody: any, professorCourses: ICourses[]) {
    for (const c of professorCourses) {
      if (c !== null && c !== undefined) {
        if (c.name === courseBody.oldCoursName) {
          const course = await this.courseModel.findById(c._id);
          course.name = this.assignProperty(c, courseBody, 'name');
          course.vizibility = this.assignProperty(c, courseBody, 'vizibility');
          course.description = this.assignProperty(
            c,
            courseBody,
            'description',
          );
          await course.save();
        }
      }
    }
  }
}
