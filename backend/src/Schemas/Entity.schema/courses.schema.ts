import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IVideo } from '../Entity/IVideo';
import { IDocumentFormat } from '../Entity/IPdf';
import { ICompilators } from '../Entity/ICompilators';
@Schema()
export class Courses {
  _id: mongoose.Types.ObjectId;
  @Prop({ type: mongoose.Types.ObjectId })
  studentId: mongoose.Types.ObjectId[];
  @Prop()
  name: string;
  @Prop()
  vizibility: boolean;
  @Prop()
  description: string;
  @Prop()
  imagePath: string;
  @Prop({ type: mongoose.Types.ObjectId })
  colaborationId: mongoose.Types.ObjectId[];
  @Prop()
  courses: [IVideo | IDocumentFormat | ICompilators];
}
export const CoursesSchema = SchemaFactory.createForClass(Courses);
