import { useRouter } from "next/navigation";
import { Student } from "./Student";
import { setCookie } from "cookies-next";
import { Professor } from "./Professor";

export class UserAuthenticationManager {
  private rout: any = useRouter();
  private entity: any = null;
  private expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  private isId(id: string) {
    setCookie("id", id);
    this.rout.push("/");
  }
  private async verifyStudentLog(user: any): Promise<string> {
    this.entity = new Student(user);
    return await this.entity.logStudent();
  }
  private async verifyProfessorLog(user: any): Promise<string> {
    this.entity = new Professor(user);
    return await this.entity.logProfessor();
  }
  private async verifyStudentSign(user:any): Promise<string>{
    this.entity = new Student(user);
    return await this.entity.NewStudent();
  }
  private async verifyProfessorSign(user:any): Promise<string>{
    this.entity = new Professor(user);
    return await this.entity.NewProfessor();
  }
  public isEmailVerify(email: any): boolean {
    return this.expression.test(email);
  }
  public signUser(user: any) {
    if (user.role === "Student") {
      this.verifyStudentSign(user)
        .then((id: string) => this.isId(id))
        .catch((err) => alert(err));
    } else if (user.role === "Professor") {
      this.verifyProfessorSign(user)
        .then((id: string) => this.isId(id))
        .catch((err) => alert(err));
    }
  }
  public logUser(user: any) {
    this.entity = new Student(user);
    this.verifyStudentLog(user)
      .then((id: string) => {
        if (id != "No_Student") {
          this.isId(id);
        } else {
          this.verifyProfessorLog(user)
            .then((id: string) => {
              if (id != "No_Professor") {
                this.isId(id);
              }
            })
            .catch((error) => {
              alert(error);
            });
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
}
