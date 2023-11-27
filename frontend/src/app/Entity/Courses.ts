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
    this.description=courses.description;
    this.imagePath=courses.imagePath;
    this.colaborationId = courses.colaborationId;
    this.curs = courses.curs;
  }
  public async newCourse() {
    const id = getCookie("id")?.toString();

    const req = await fetch(
      `${urlBackend}curs/new`,
      sendToServerCookies(this, id)
    );
    return req.text();
  }
}
