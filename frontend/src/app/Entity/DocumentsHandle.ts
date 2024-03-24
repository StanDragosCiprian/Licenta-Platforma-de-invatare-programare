import {
  getFromServerCookie,
  sendFiles,
  urlBackend,
} from "../UserServer/ServerRequest";
import { getCookie } from "cookies-next";
export class DocumentHandle {
  private cursName: string = "";
  constructor(videoName: string) {
    this.cursName = videoName;
  }
  private async getProfessorName(): Promise<string> {
    const professor = await fetch(
      `${urlBackend}courses/professorName`,
      getFromServerCookie(getCookie("id"))
    );
    return await professor.text();
  }
  private async setDocs(
    filePath: string,
    professorName: string,
    title: string
  ): Promise<string> {
    const res = await fetch(
      `${urlBackend}courses/${professorName}/${this.cursName}/${title}/add/document/Docs`,
      sendFiles(filePath)
    );
    return await res.text();
  }
  public async sendText(file: string, title: string) {
    const professorName = await this.getProfessorName();
    const video = await this.setDocs(file, professorName,title);

    return await video;
  }
}
