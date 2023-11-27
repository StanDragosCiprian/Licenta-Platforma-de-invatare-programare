import { useRouter } from "next/navigation";
import { Student } from "./Student";
import { setCookie } from "cookies-next";
import { Professor } from "./Professor";
import { Admin } from "./Admin";

export class UserAuthenticationManager {
  private rout: any = useRouter();
  private entity: any = null;
  private expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  private isId(id: string) {
    setCookie("id", id);
    this.rout.push("/");
    this.rout.refresh();
  }
  private async verifyStudentLog(user: any): Promise<string> {
    this.entity = new Student(user);
    return await this.entity.logStudent();
  }
  private async verifyProfessorLog(user: any): Promise<string> {
    this.entity = new Professor(user);
    return await this.entity.logProfessor();
  }

  private async verifyAdminLog(user: any): Promise<string> {
    this.entity = new Admin(user);
    return await this.entity.logAdmin();
  }
  private async verifyStudentSign(user: any): Promise<string> {


    user.role = "Student";
    this.entity = new Student(user);
    return await this.entity.NewStudent();
  }
  private async verifyProfessorSign(user: any): Promise<string> {
    this.entity = new Professor(user);
    return await this.entity.NewProfessor();
  }
  public isEmailVerify(email: any): boolean {
    return this.expression.test(email);
  }
  public async signUser(user: any): Promise<any> {
       await this.verifyStudentSign(user).then((id)=>{
        this.isId(id);
       });
  }
  private async verifyUser(user: any): Promise<any> {
    return [
      this.verifyStudentLog(user),
      this.verifyProfessorLog(user),
      this.verifyAdminLog(user),
    ];
  }
  public async logUser(user: any) {
    for (let userLog of await this.verifyUser(user)) {
      const id = await userLog;
      if (id !== ' ') {
        this.isId(id);
        break;
      }
    }
   }
}
