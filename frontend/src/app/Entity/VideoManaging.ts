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
    const test = await fetch(
      "/api/handleNewVideoApi",
      sendToServerCookies(
        {
          title: title,
          description: description,
          videoPath: video,
          videoName: this.videoName,
        },
        undefined
      )
    );
    const { text } = await test.json();

    return text;
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
        {
          title: title,
          description: description,
          videoPath: video,
          videoName: this.videoName,
          coursName: coursName,
        },
        undefined
      )
    );
    const { text } = await test.json();

    return text;
  }
  private async getProfessorName(): Promise<string> {
    const professor = await fetch(
      `${urlBackend}courses/professorName`,
      getFromServerCookie(getCookie("id"))
    );
    return await professor.text();
  }
  private async setVideo(
    filePath: string,
    professorName: string
  ): Promise<string> {
    const response = await fetch(
      `${urlBackend}courses/video/${professorName}/${this.videoName}/add/video/videoInput`,
      sendFiles(filePath)
    );
    //http://localhost:3000/courses/video/mmm/few/add/video/videoInput',
    console.log(`${urlBackend}courses/video/${professorName}/${this.videoName}/add/video/videoInput`);
    const r=await response.text();
    return r;
  }
  private async setUpdateVideo(
    filePath: string,
    professorName: string,
    videoName: string
  ): Promise<string> {
    console.log(
      `${urlBackend}courses/${professorName}/${this.videoName}/${videoName}/add/video/Update/videoInput`
    );
    const response = await fetch(
      `${urlBackend}courses/video/${professorName}/${this.videoName}/${videoName}/add/video/Update/videoInput`,
      sendFiles(filePath)
    );
    return await response.text();
  }
  public async sendTextUpdate(
    title: string,
    description: string,
    file: string,
    coursName: string
  ) {
    const professorName = await this.getProfessorName();
    let video = "";
    if (file !== "")
      video = await this.setUpdateVideo(file, professorName, coursName);
    console.log(video);
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
    const r=await response;
    console.log('response: ',r);
    return r;
  }
}
