import { Types } from 'mongoose';
import { IVideo } from '../Entity/IVideo';
import { IDocumentFormat } from '../Entity/IPdf';
import { ICompilators } from '../Entity/ICompilators';
export class CoursesDto {
  _id: Types.ObjectId;
  name: string;
  vizibility: boolean;
  description: string;
  imagePath: string;
  studentId: Types.ObjectId[];
  colaborationId: Types.ObjectId[];
  courses: [IVideo | IDocumentFormat | ICompilators];
}
