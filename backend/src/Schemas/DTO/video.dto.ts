import { Types } from 'mongoose';

export class VideoDto {
  _id: Types.ObjectId;
  videoPath: string;
  title: string;
  descrition: string;
}
