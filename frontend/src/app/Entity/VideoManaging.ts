import { getCookie } from "cookies-next";
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
  ): Promise<string> {
    const response = await fetch(
      `${urlBackend}curs/${this.videoName}/add/video/textInput`,
      sendToServerCookies(
        { title: title, description: description, videoPath: video },
        undefined
      )
    );
    return await response.text();
  }
  private async getProfessorName(): Promise<string> {
    const professor = await fetch(
      `${urlBackend}curs/professorName`,
      getFromServerCookie(getCookie("id"))
    );
    return await professor.text();
  }
  private async setVideo(
    filePath: string,
    professorName: string
  ): Promise<string> {
    const response = await fetch(
      `${urlBackend}curs/${professorName}/${this.videoName}/add/video/videoInput`,
      sendFiles(filePath)
    );
    return await response.text();
  }
  public async sendText(title: string, description: string, file: string) {
    const professorName = await this.getProfessorName();
    const video = await this.setVideo(file, professorName);
    const response: string = await this.setVideoText(title, description, video);
    return await response;
  }
}
