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
    return this.res.json();
  }
  private async getAdmin(): Promise<any> {
    this.res = await fetch(`${url}admin/get`, getUserFromServer(this.id));
    return this.res.json();
  }
  public async getUser(notUser: string) {
    if (this.id !== undefined) {
      const student = await this.getStudent();
      console.log('student: ', student);
      if (student !== "No_Student") {
        return JSON.parse(student);
      } else {
        if (this.res !== undefined) {
          const professor = await this.getProfessor();
          console.log('professor: ', professor);
          if (professor !== "No_Professor") {
            return professor;
          } else {
            const admin = await this.getAdmin();
            console.log('admin: ', admin);
            if (admin !== "No_Admin") {
              return admin;
            }
          }
        }
      }
    }
    this.res = JSON.parse(JSON.stringify({ username: notUser }));
    return this.res;
  }
  
}
