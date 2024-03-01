import {
  sendToServerCookies,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { getCookie } from "cookies-next";

export class Courses implements ICourses {
  name: string = "";
  vizibility: boolean = false;
  studentId: any = [];
  description: string = "";
  imagePath: string = "";
  colaborationId: any = [];
  curs: any = [];
  constructor(courses: ICourses) {
    this.name = courses.name;
    this.vizibility = courses.vizibility;
    this.studentId = courses.studentId;
    this.description = courses.description;
    this.imagePath = courses.imagePath;
    this.colaborationId = courses.colaborationId;
    this.curs = courses.curs;
  }
  public async newCourse() {
    const id = getCookie("id")?.toString();
    const option = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cursBody: this }),
    };
    const api = await fetch(
      "/api/handleNewCourseApi",
      sendToServerCookies(this, id)
    );
    const { text } = await api.json();
    return text;
  }
}
