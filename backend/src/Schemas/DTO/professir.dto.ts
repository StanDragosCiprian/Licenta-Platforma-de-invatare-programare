import { UserDto } from './user.dto';
import { IsArray } from 'class-validator';
import { Types } from 'mongoose';
export class ProfessorDto extends UserDto {
  @IsArray()
  studentList: [];
  @IsArray()
  colaborationId: [];

  coursesId: Types.ObjectId[];
}
