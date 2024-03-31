import { Model, Types } from 'mongoose';
import { ICurs } from 'src/Schemas/Entity/ICurs';

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
}
