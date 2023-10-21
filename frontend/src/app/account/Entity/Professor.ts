import { sendToServer, url } from "../../UserServer/ServerRequest";
import { IProfessor } from "../core/IProfessor";
import { IUser } from "../core/IUser";

export class Professor implements IProfessor {
  studentList: any = [];
  colaborationId: any = [];
  coursesId: any = [];
  username: string = "";
  email: string = "";
  password: string = "";
  profileImage: string = "";
  role: string = "proffessor";
  constructor(user: IUser) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
  }
  public NewProfessor = async (): Promise<string> => {
    const response = await fetch(`${url}professor/new`, sendToServer(this));
    const data = await response.json();
    return data.entity._id;
  };
  public logProfessor = async (): Promise<string> => {
    const response = await fetch(`${url}professor/log`, sendToServer(this));
    const data = await response.text();

    return data;
  };
}
