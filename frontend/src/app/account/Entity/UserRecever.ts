import { getUserFromServer, url } from "@/app/UserServer/ServerRequest";
import { cookies } from "next/headers";
export class UserRecever {
  private id: any = cookies().get("id")?.value;
  private res: any = null;

  private async getStudent() {
    this.res = await fetch(`${url}student/get`, getUserFromServer(this.id));
    const text = await this.res.text();
    return text;
  }
  private async getProfessor() {
    this.res = await fetch(`${url}professor/get`, getUserFromServer(this.id));
    const text = await this.res.text();
    return text;
  }
  private async getAdmin(): Promise<any> {
    this.res = await fetch(`${url}admin/get`, getUserFromServer(this.id));
    const text = await this.res.text();
    return text;
  }
  private userArray = [this.getStudent, this.getProfessor, this.getAdmin];
  public async getUser(notUser: string) {
    if (this.id !== undefined) {
      for (let user of this.userArray) {
        const result = await user.call(this);
        if (result !== " ") {
          return JSON.parse(result);
        }
      }
    }
    this.res = JSON.parse(JSON.stringify({ username: notUser }));
    return this.res;
  }
}
