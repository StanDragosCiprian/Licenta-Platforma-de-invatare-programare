import { IsArray } from 'class-validator';
import { Types } from 'mongoose';
import { VideoDto } from './video.dto';

export class CursDto {
  _id: Types.ObjectId;

  @IsArray()
  curs: (VideoDto | null)[];
}
