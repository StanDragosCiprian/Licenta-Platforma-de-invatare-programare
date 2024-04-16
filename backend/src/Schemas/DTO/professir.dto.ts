import { UserDto } from './user.dto';
import { Types } from 'mongoose';
export class ProfessorDto extends UserDto {
  coursesId: Types.ObjectId[];
}
