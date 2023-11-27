import { getFromServer, urlBackend } from "@/app/UserServer/ServerRequest";

export class CoursManager {
  private async takeCoursName(path: string): Promise<string> {

    const name = await fetch(`${urlBackend}curs/${path}`, getFromServer());
    const text: string = await name.text();
    return text;
  }
  public async coursName(path: string): Promise<string> {
    return await this.takeCoursName(path);
  }
}
