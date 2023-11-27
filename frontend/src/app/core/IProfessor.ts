import { IUser } from "./IUser";
export interface IProfessor extends IUser{
    studentList: [];
    colaborationId: [];
    coursesId: [];
}