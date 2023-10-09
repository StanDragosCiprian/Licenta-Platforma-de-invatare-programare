import { IUser } from './IUser';
import { Types } from 'mongoose';
export interface IProfessor extends IUser {
  studentEvaluate: JSON;
  studentList: JSON;
  colaborationId: JSON;
  coursesId: Types.ObjectId[];
}
