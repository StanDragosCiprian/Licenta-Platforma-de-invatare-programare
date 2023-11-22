import { getUserFromServer, urlBackend } from "@/app/UserServer/ServerRequest";
import { cookies } from "next/headers";
import { IStudent } from "../core/IStudent";
import { IProfessor } from "../core/IProfessor";
import { IAdmin } from "../core/IAdmin";
export class UserRecever {
  //: Promise<IStudent | IProfessor | IAdmin>
  private id: any = cookies().get("id")?.value;
  private res: any = null;
  private async verifyUser(path: string): Promise<string> {
    this.res = await fetch(`${urlBackend}${path}`, getUserFromServer(this.id));
    const text = await this.res.text();
    
    return text;
  }
  private async verifyRole(path: string) {
    const role = await fetch(
      `${urlBackend}${path}`,
      getUserFromServer(this.id)
    );
    const isRole = await role.json();
    return isRole;
  }
  //'admin/isAdmin'
  public async isRole(path: string) {
    return await this.verifyRole(path);
  }
  private async userArray(): Promise<any> {
    return [
      this.verifyUser("student/get"),
      this.verifyUser("professor/get"),
      this.verifyUser("admin/get"),
    ];
  }

  public async getUser(notUser: string) {
    if (this.id !== undefined) {
      for (let user of await this.userArray()) {
        const result = await user;
        if (result !== " ") {
          return JSON.parse(result);
        }
      }
    }
    this.res = JSON.parse(JSON.stringify({ username: notUser }));
    return this.res;
  }
}
