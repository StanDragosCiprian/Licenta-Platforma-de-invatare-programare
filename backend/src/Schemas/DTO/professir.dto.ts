import { UserDto } from './user.dto';
import { IsJSON } from 'class-validator';
import { Types } from 'mongoose';
export class ProfessorDto extends UserDto {
  @IsJSON()
  studentEvaluate: JSON;
  @IsJSON()
  studentList: JSON;
  @IsJSON()
  colaborationId: JSON;

  coursesId: Types.ObjectId[];
}
