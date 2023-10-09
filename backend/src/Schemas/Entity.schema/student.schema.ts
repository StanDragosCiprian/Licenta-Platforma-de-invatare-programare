import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
@Schema()
class Student extends User {
  @Prop({ type: JSON })
  enroleCourse: JSON;
  @Prop({ type: JSON })
  finishCourse: JSON;
  @Prop({ type: JSON })
  favorite: JSON;
}
export const StudentSchema = SchemaFactory.createForClass(Student);
