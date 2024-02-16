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
      `${urlBackend}curs/professorName`,
      getFromServerCookie(getCookie("id"))
    );
    console.log(professor);
    return await professor.text();
  }
  private async setDocs(
    filePath: string,
    professorName: string
  ): Promise<string> {
    const res = await fetch(
      `${urlBackend}curs/${professorName}/${this.cursName}/add/document/Docs`,
      sendFiles(filePath)
    );
    return await res.text();
  }
  public async sendText( file: string) {
    const professorName = await this.getProfessorName();
    const video = await this.setDocs(file, professorName);

    return await video;
  }
}
