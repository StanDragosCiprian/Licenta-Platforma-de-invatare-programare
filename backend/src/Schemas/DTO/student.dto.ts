import { UserDto } from './user.dto';
import { IsJSON } from 'class-validator';
export class StudentDto extends UserDto {
  @IsJSON()
  enroleCourse: JSON;
  @IsJSON()
  finishCourse: JSON;
  @IsJSON()
  favorite: JSON;
}
