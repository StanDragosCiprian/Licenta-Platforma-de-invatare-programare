import { sendToServer, url } from "../../UserServer/ServerRequest";
import { IStudent } from "../core/IStudent";
import { IUser } from "../core/IUser";

export class Student implements IStudent {
  enroleCourse: any = [];
  finishCourse: any = [];
  username: string = "";
  email: string = "";
  password: string = "";
  profileImage: string = "";
  role: string = "student";

  constructor(user: IUser) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
  }
  public NewStudent = async (): Promise<string> => {
    const response = await fetch(`${url}student/new`, sendToServer(this));
    const data = await response.json();
    return data.entity._id;
  };
  public logStudent = async (): Promise<string> => {
    const response = await fetch(`${url}student/log`, sendToServer(this));
    const data = await response.text();

    return data;
  };
}
