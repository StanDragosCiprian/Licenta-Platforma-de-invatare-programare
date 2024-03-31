import { urlBackend } from "@/app/UserServer/ServerRequest";

export class CoursManager {
  private async fetchCourseTitles(path: string): Promise<any> {
    const name = await fetch(`${urlBackend}courses/video/${path}/videoCourse`, {
      next: { revalidate: 5 },
    });
    const text: any = await name.json();
    const titles = text.map((obj: { title: string }) => obj.title);

    return titles;
  }
  async getCourseTitles(path: string): Promise<string[]> {
    return await this.fetchCourseTitles(path);
  }
  private async fetchCourse(path: string): Promise<any> {
    const name = await fetch(`${urlBackend}courses/${path}/fullCours`, {
      next: { revalidate: 5 },
    });
    const text: any = await name.json();

    return text;
  }
  private async dragAndDropFetch(cursName: string, drag: string, drop: string) {
    const name = await fetch(
      `${urlBackend}courses/${cursName}/${drag}/${drop}/dragAndDrop`,
      {
        next: { revalidate: 5 },
      }
    );
  }
  async getCourse(name: string) {
    return await this.fetchCourse(name);
  }
  async changeIndexCours(cursName: string,drag: string, drop: string) {
    this.dragAndDropFetch(cursName,drag, drop);
  }
}
