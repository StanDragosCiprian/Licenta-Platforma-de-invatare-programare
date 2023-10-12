import { Document, Types } from 'mongoose';
import { IPdf } from './IPdf';
import { IVideo } from './IVideo';
import { ICompilators } from './ICompilators';

export interface ICurs extends Document {
  _id: Types.ObjectId;
  studentId: Types.ObjectId[];
  colaborationId: Types.ObjectId[];
  curs: [IVideo | IPdf | ICompilators];
}
