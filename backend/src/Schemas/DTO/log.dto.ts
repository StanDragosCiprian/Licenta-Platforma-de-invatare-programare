import { IsEmail, IsString, MaxLength } from 'class-validator';

export class LogDto {
  @IsString()
  @MaxLength(200)
  @IsEmail()
  email: string;
  @IsString()
  @MaxLength(100)
  password: string;
}
