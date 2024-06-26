import { Document, Types } from 'mongoose';
import { IDocumentFormat } from './IPdf';
import { IVideo } from './IVideo';
import { ICompilators } from './ICompilators';

export interface ICourses extends Document {
  _id: Types.ObjectId;
  name: string;
  vizibility: boolean;
  description: string;
  imagePath: string;
  studentId: Types.ObjectId[];
  colaborationId: Types.ObjectId[];
  courses: [IVideo | IDocumentFormat | ICompilators];
}
