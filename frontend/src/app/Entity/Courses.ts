import {
  sendToServerCookies,
  urlBackend,
} from "@/app/UserServer/ServerRequest";
import { getCookie } from "cookies-next";
import { notFound } from "next/navigation";

export class Courses implements ICourses {
  name: string = "";
  vizibility: boolean = false;
  studentId: any = [];
  description: string = "";
  imagePath: string = "";
  colaborationId: any = [];
  courses: any = [];
  constructor(courses: ICourses) {
    this.name = courses.name;
    this.vizibility = courses.vizibility;
    this.studentId = courses.studentId;
    this.description = courses.description;
    this.imagePath = courses.imagePath;
    this.colaborationId = courses.colaborationId;
    this.courses = courses.courses;
  }
  public async updateCourse(courseName: string) {
    const id = getCookie("id")?.toString();
    const option = {
      method: "Post",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseBody: this, oldCourseName: courseName }),
    };
    const api = await fetch(
      `/api/handleUpdateCourseApi`,
      sendToServerCookies(JSON.stringify(option), id)
    );
    if (!api.ok) notFound();
  }
  public async newCourse() {
    const id = getCookie("id")?.toString();
    const option = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ courseBody: this }),
    };
    const api = await fetch(
      "/api/handleNewCourseApi",
      sendToServerCookies(JSON.stringify(this), id)
    );
    if (api.ok) {
      const { text } = await api.json();
      return text;
    } else {
      notFound();
    }
  }
}
