import { IsIn, IsEmail, IsString, MaxLength } from 'class-validator';
import { Types } from 'mongoose';
export class AdminDto {
  id: Types.ObjectId;
  @IsString()
  @MaxLength(100)
  username: string;
  @IsString()
  @MaxLength(200)
  @IsEmail()
  email: string;
  @IsString()
  @MaxLength(100)
  password: string;
  @IsString()
  @MaxLength(100)
  profileImage: string;
  @IsString()
  @IsIn(['Admin'])
  role: string;
}
