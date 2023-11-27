import { sendFiles, urlBackend } from "@/app/UserServer/ServerRequest";

export class AdminsService {
  public async sendProfessor(file: any) {
    const res = await fetch(`${urlBackend}admin/exel`,sendFiles(file) );  
}
  }

