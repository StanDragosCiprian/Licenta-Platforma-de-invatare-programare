import { url } from "../../UserServer/url.enum";
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
    const response = await fetch(`${url}student/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this),
    });
    const data = await response.json();
    return data.entity._id;
  };
}
