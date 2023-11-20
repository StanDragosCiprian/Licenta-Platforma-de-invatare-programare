import { Types } from 'mongoose';
import { IVideo } from '../Entity/IVideo';
import { IPdf } from '../Entity/IPdf';
import { ICompilators } from '../Entity/ICompilators';
export class CursDto {
  _id: Types.ObjectId;
  name: string;
  vizibility: boolean;
  studentId: Types.ObjectId[];
  colaborationId: Types.ObjectId[];
  curs: [IVideo | IPdf | ICompilators];
}
