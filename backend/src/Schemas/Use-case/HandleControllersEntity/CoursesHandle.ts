import { Model, Types } from 'mongoose';
import { ICurs } from 'src/Schemas/Entity/ICurs';
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
  async takeCoursId(cursName: string): Promise<Types.ObjectId> {
    return (await this.courseModel.findOne({ name: cursName }))._id;
  }
  async takeCours(cursId: Types.ObjectId): Promise<ICurs> {
    return await this.courseModel.findOne({ _id: cursId });
  }
  async deleteCourse(courseName: string, c: ICurs) {
    if (c.name === courseName) {
      for (const cs of c.curs) {
        if (cs.format === 'Video') {
          const video = cs as IVideo;
          const vid = video.videoPath.replace(/\//g, '\\');
          const filePath = path.resolve(
            `${FILELOCATION}\\backend\\src\\VideoTutorial\\${vid}`,
          );
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          } else {
            console.log(`File does not exist: ${filePath}`);
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
        await this.courseModel.deleteOne({ _id: c._id });
      }
    }
  }
  async changeDirectoryfromCourse(
    courseId: Types.ObjectId[],
    oldName: string,
    newName: string,
  ) {
    for (const c of courseId) {
      const courses = await this.courseModel.findOne({ _id: c });
      for (const cs of courses.curs) {
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
      const newCourse = await new this.courseModel(courses);
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
  async updateCourse(cursBody: any, professorCourses: ICurs[]) {
    for (const c of professorCourses) {
      if (c !== null && c !== undefined) {
        if (c.name === cursBody.oldCoursName) {
          const course = await this.courseModel.findById(c._id);
          course.name = this.assignProperty(c, cursBody, 'name');
          course.vizibility = this.assignProperty(c, cursBody, 'vizibility');
          course.description = this.assignProperty(c, cursBody, 'description');
          await course.save();
        }
      }
    }
  }
}
