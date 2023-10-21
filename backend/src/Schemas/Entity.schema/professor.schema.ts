import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

@Schema()
class Professor extends User {
  @Prop()
  studentList: [];
  @Prop()
  colaborationId: [];
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] })
  coursesId: Types.ObjectId[];
}
export const ProfesorSchema = SchemaFactory.createForClass(Professor);
