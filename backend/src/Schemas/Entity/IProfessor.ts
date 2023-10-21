import { IUser } from './IUser';
import { Types } from 'mongoose';
export interface IProfessor extends IUser {
  studentList: [];
  colaborationId: [];
  coursesId: Types.ObjectId[];
}
