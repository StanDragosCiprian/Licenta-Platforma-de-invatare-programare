import { sendToServer, url } from "@/app/UserServer/ServerRequest";
import { IUser } from "../core/IUser";

export class Admin implements IUser {
  username: string = "";
  email: string = "";
  password: string = "";
  profileImage: string = "";
  role: string = "admin";
  constructor(user: IUser) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
  }
  public logAdmin = async (): Promise<string> => {
    const response = await fetch(`${url}admin/log`, sendToServer(this));
    const data = await response.json();
    const myData:string=data.access_token;
    console.log('myData: ', myData);
    return myData;
  };
}
