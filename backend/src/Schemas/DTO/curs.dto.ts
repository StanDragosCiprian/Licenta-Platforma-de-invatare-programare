import { Types } from 'mongoose';
import { IVideo } from '../Entity/IVideo';
import { IPdf } from '../Entity/IPdf';
import { ICompilators } from '../Entity/ICompilators';
export class CursDto {
  _id: Types.ObjectId;
  name: string;
  vizibility: boolean;
  description: string;
  imagePath: string;
  studentId: Types.ObjectId[];
  colaborationId: Types.ObjectId[];
  curs: [IVideo | IPdf | ICompilators];
}
