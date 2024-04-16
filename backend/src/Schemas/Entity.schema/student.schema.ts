import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.schema';
@Schema()
class Student extends User {}
export const StudentSchema = SchemaFactory.createForClass(Student);
