import { IUser } from './IUser';

export interface IStudent extends IUser {
  enroleCourse: JSON;
  finishCourse: JSON;
  favorite: JSON;
}
