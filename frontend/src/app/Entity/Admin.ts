import { sendToServer, urlBackend } from "@/app/UserServer/ServerRequest";
import { IAdmin } from "../core/IAdmin";

export class Admin implements IAdmin {
  username: string = "";
  email: string = "";
  password: string = "";
  profileImage: string = "";
  role: string = "admin";
  constructor(user: IAdmin) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
  }

  public logAdmin = async (): Promise<string> => {
    const response = await fetch(`${urlBackend}admin/log`, sendToServer(this));
    const data = await response.json();
    const myData:string=data.access_token;
    return myData;
  };
  public sendExel=async():Promise<any>=>{
    const response = await fetch(`${urlBackend}admin/exel`, sendToServer(this));
  }
}
