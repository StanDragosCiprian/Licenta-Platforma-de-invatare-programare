import { sendToServer, urlBackend } from "../UserServer/ServerRequest";
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
  role: string = "professor";
  constructor(user: IUser) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
  }
  public NewProfessor = async (): Promise<any> => {
    const response = await fetch(`${urlBackend}professor/new`, sendToServer(this));
    const data = await response.json();
    return data.access_token;
  };
  public logProfessor = async (): Promise<string> => {
    const response = await fetch(`${urlBackend}professor/log`, sendToServer(this));
    const data = await response.json();
    const myData:string=data.access_token;
    return myData;
  };
}
