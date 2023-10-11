import { Document } from 'mongoose';
export interface IVideo extends Document {
  videoPath: string;
  title: string;
  descrition: string;
}
