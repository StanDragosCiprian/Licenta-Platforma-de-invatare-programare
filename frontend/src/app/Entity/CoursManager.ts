import { urlBackend } from "@/app/UserServer/ServerRequest";

export class CoursManager {
  private async fetchCourseTitles(
    path: string
  ): Promise<Array<{ title: string; format: string }>> {
    const name = await fetch(
      `${urlBackend}courses/${path}/get/course/name/preview`,
      {
        next: { revalidate: 0 },
      }
    );
    const text: any = await name.json();
    const titles = text.map((obj: { title: string; format: string }) => {
      return { title: obj.title, format: obj.format };
    });

    return titles;
  }
  async getCourseTitles(path: string): Promise<Array<{ title: string; format: string }>> {
    return await this.fetchCourseTitles(path);
  }
  private async fetchCourse(path: string): Promise<any> {
    const name = await fetch(`${urlBackend}courses/${path}/fullCours`, {
      next: { revalidate: 0 },
    });
    const text: any = await name.json();

    return text;
  }
  private async dragAndDropFetch(cursName: string, drag: string, drop: string) {
    const name = await fetch(
      `${urlBackend}courses/${cursName}/${drag}/${drop}/dragAndDrop`,
      {
        next: { revalidate: 0 },
      }
    );
  }
  async getCourse(name: string) {
    return await this.fetchCourse(name);
  }
  async changeIndexCours(cursName: string, drag: string, drop: string) {
    this.dragAndDropFetch(cursName, drag, drop);
  }
}
