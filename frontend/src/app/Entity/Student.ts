import { sendToServer, urlBackend } from "../UserServer/ServerRequest";
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
  public NewStudent = async (): Promise<any> => {
    const response = await fetch(`${urlBackend}student/new`, sendToServer(this));
    const data = await response.json();
    return data.access_token;
  };
  public logStudent = async (): Promise<any> => {
    const response = await fetch(`${urlBackend}student/log`, sendToServer(this));
    const data = await response.json();
    return data.access_token;
  };
}
