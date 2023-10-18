import { IUser } from "./IUser";

export interface IStudent extends IUser{
    enroleCourse: [];
    finishCourse: [];
}