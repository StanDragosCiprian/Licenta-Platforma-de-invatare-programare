import { getCookie } from "cookies-next";
import { sendFiles, sendToServerCookies } from "../UserServer/ServerRequest";
import { notFound } from "next/navigation";
export class VideoManaging {
  private videoName: string = "";
  constructor(videoName: string) {
    this.videoName = videoName;
  }
  private async setVideoText(
    title: string,
    description: string,
    video: string
  ): Promise<string> {
    const test = await fetch(
      "/api/handleNewVideoApi",
      sendToServerCookies(
        JSON.stringify({
          title: title,
          description: description,
          videoPath: video,
          videoName: this.videoName,
        }),
        undefined
      )
    );
    const { text, ok } = await test.json();
    if (ok) {
      return text;
    } else {
      notFound();
    }
  }
  private async setVideoTextUpdate(
    title: string,
    description: string,
    video: string,
    coursName: string
  ): Promise<string> {
    const test = await fetch(
      "/api/handleUpdateCourseApi/handleSendUpdateVideoApi",
      sendToServerCookies(
        JSON.stringify({
          title: title,
          description: description,
          videoPath: video,
          videoName: this.videoName,
          coursName: coursName,
        }),
        undefined
      )
    );
    const { text, ok } = await test.json();
    if (!ok) notFound();
    return text;
  }
  private async getProfessorName(): Promise<string> {
    const option = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
        Cookie: `id=${getCookie("id")}`,
      },
    };
    const professor = await fetch(
      "/api/handleProfessorApi/professorName",
      option
    );
    const { text, ok } = await professor.json();
    if (ok) return text;
    else notFound();
  }
  private async setVideo(
    filePath: string,
    professorName: string
  ): Promise<string> {
    const body = new FormData();
    body.set("file", filePath);
    body.set("professorName", professorName);
    body.set("videoName", this.videoName);
    const response = await fetch(
      "/api/handleVideoApi/videoInput",
      sendFiles(body, getCookie("id"))
    );
    const { text, ok } = await response.json();
    if (!ok) notFound();
    return text;
  }
  private async setUpdateVideo(
    filePath: string,
    professorName: string,
    courseName: string
  ): Promise<string> {
    const body = new FormData();
    body.set("file", filePath);
    body.set("professorName", professorName);
    body.set("courseName", courseName);
    body.set("videoName", this.videoName);
    const response = await fetch(
      "/api/handleVideoApi/videoInputUpdate",
      sendFiles(body, getCookie("id"))
    );
    const { text, ok } = await response.json();
    if (!ok) notFound();
    return text;
  }
  public async sendTextUpdate(
    title: string,
    description: string,
    file: string,
    coursName: string
  ) {
    const professorName = await this.getProfessorName();
    let video = "";
    if (file !== "") {
      video = await this.setUpdateVideo(file, professorName, coursName);
    }
    const response: string = await this.setVideoTextUpdate(
      title,
      description,
      video,
      coursName
    );
    return await response;
  }
  public async sendText(title: string, description: string, file: string) {
    const professorName = await this.getProfessorName();
    const video = await this.setVideo(file, professorName);
    const response: string = await this.setVideoText(title, description, video);
    const r = await response;
    return r;
  }
}
