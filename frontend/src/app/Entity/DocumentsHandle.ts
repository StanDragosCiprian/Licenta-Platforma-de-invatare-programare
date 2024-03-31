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
      `${urlBackend}courses/docs/${professorName}/${this.cursName}/${title}/add/document/Docs`,
      sendFiles(filePath)
    );
    return await res.text();
  }
  public async sendText(file: string, title: string) {
    const professorName = await this.getProfessorName();
    const video = await this.setDocs(file, professorName,title);

    return await video;
  }
  private async setDocsUpdate(
    filePath: string,
    professorName: string,
    pdfTitle: string,
    newPdfTitle: string

  ): Promise<string> {
    newPdfTitle=newPdfTitle === ""?"_":newPdfTitle;
  
    const res = await fetch(
      `${urlBackend}courses/docs/${professorName}/${pdfTitle}/${this.cursName}/${newPdfTitle}/add/pdf/Update/pdfInput`,
      sendFiles(filePath)
    );
    return await res.text();
  }
  public async sendTextUpdate(file: string, pdfTitle: string, newPdfTitle: string) {
    const professorName = await this.getProfessorName();
 await this.setDocsUpdate(file, professorName,pdfTitle,newPdfTitle);
  }
}
