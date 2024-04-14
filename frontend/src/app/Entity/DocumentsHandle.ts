import { notFound } from "next/navigation";
import {
  getFromServerCookie,
  sendFiles,
  urlBackend,
} from "../UserServer/ServerRequest";
import { getCookie } from "cookies-next";
export class DocumentHandle {
  private courseName: string = "";
  constructor(videoName: string) {
    this.courseName = videoName;
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
    const pdf = new FormData();
    pdf.set("file", filePath);
    pdf.set("professorName", professorName);
    pdf.set("courseName", this.courseName);
    pdf.set("title", title);
    const res = await fetch(
      "/api/handlePdfApi/addDocs",
      sendFiles(pdf, getCookie("id"))
    );
    const { text, ok } = await res.json();
    if (ok) {
      return text;
    } else {
      notFound();
    }
  }
  public async sendText(file: string, title: string, professorName: string) {
    const video = await this.setDocs(file, professorName, title);

    return await video;
  }
  private async setDocsUpdate(
    filePath: string,
    professorName: string,
    pdfTitle: string,
    newPdfTitle: string
  ): Promise<string> {
    newPdfTitle = newPdfTitle === "" ? "_" : newPdfTitle;
    const pdf = new FormData();
    pdf.set("file", filePath);
    pdf.set("professorName", professorName);
    pdf.set("pdfTitle", pdfTitle);
    pdf.set("newPdfTitle", newPdfTitle);
    pdf.set("courseName", this.courseName);
    const res = await fetch(
      "/api/handlePdfApi/updateDocs",
      sendFiles(pdf, getCookie("id"))
    );
    const { text, ok } = await res.json();
    if (ok) return text;
    else notFound();
  }
  public async sendTextUpdate(
    file: string,
    pdfTitle: string,
    newPdfTitle: string
  ) {
    const professorName = await this.getProfessorName();
    await this.setDocsUpdate(file, professorName, pdfTitle, newPdfTitle);
  }
}
