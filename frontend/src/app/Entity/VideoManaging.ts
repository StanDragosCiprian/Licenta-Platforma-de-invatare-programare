import { cookies } from "next/headers";
import {
  getFromServerCookie,
  sendFiles,
  sendToServerCookies,
  urlBackend,
} from "../UserServer/ServerRequest";

export class VideoManaging {
  private videoName: string = "";
  constructor(videoName: string) {
    this.videoName = videoName;
  }
  private async setVideoText(
    title: string,
    description: string,
    video: string
  ): Promise<void> {
    const res = await fetch(
      `${urlBackend}curs/${this.videoName}/add/video/textInput`,
      sendToServerCookies(
        { title: title, description: description, videoPath: video },
        undefined
      )
    );
  }
  private async getProfessorName(): Promise<string> {
    const res = await fetch(
      `${urlBackend}curs/professorName`,
      getFromServerCookie(cookies().get("id")?.value)
    );
    return await res.text();
  }
  private async setVideo(
    filePath: string,
    professorName: string
  ): Promise<string> {
    const res = await fetch(
      `${urlBackend}curs/${professorName}/${this.videoName}/add/video/videoInput`,
      sendFiles(filePath)
    );
    return await res.text();
  }
  public async sendText(title: string, description: string, file: string) {
    const professorName = await this.getProfessorName();
    const video = await this.setVideo(file, professorName);
    const res = await this.setVideoText(title, description, video);
  }
}
