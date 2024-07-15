import { sendToServer, urlBackend } from "../UserServer/ServerRequest";
import { IUser } from "../core/IUser";

export class Student implements IUser {
  username: string = "";
  email: string = "";
  password: string = "";
  profileImage: string = "http://localhost:3000/default/img";
  role: string = "student";

  constructor(user: IUser) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
  }
  public NewStudent = async (): Promise<any> => {
    const response = await fetch('/api/handleStudent/NewStudent', sendToServer(this));
    const data = await response.json();
    return data.studentData;
  };
  public logStudent = async (): Promise<any> => {
    const response = await fetch(
      `${urlBackend}student/log`,
      sendToServer(this)
    );
    const data = await response.json();
    return data.access_token;
  };
}
