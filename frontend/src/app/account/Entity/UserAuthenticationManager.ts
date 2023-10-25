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
  private async verifyStudentSign(user: any): Promise<string> {
    this.entity = new Student(user);
    return await this.entity.NewStudent();
  }
  private async verifyProfessorSign(user: any): Promise<string> {
    console.log(user);
    this.entity = new Professor(user);
    return await this.entity.NewProfessor();
  }
  public isEmailVerify(email: any): boolean {
    return this.expression.test(email);
  }
  public async signUser(user: any) {
    if (user.role === "Student") {
      try {
        const id = await this.verifyStudentSign(user);
        this.isId(id);
      } catch (err) {
        console.log(err);
      }
    }
    if (user.role === "Professor") {
      try {
        const id = await this.verifyProfessorSign(user);
        this.isId(id);
      } catch (err) {
        console.log(err);
      }
    }
  }

  public async logUser(user: any) {
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
              error;
            });
        }
      })
      .catch((error) => {
        error;
      });
  }
}
