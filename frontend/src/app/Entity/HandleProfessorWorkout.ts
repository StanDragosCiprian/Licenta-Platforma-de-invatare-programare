import { cookies, headers } from "next/headers";
import { UserRecever } from "./UserRecever";
import { urlFrontend } from "../UserServer/ServerRequest";

export class HandleProfessorWorkout {
  static getId = async () => {
    const userManager = new UserRecever();
    return (
      cookies().get("id") && (await userManager.isRole("admin/isProfessor"))
    );
  };
  static getProfessorId = async () => {
    const userManager = new UserRecever();
    return (
      cookies().get("id") && (await userManager.isRole("professor/isProfessor"))
    );
  };
  static getStudentId = async () => {
    const userManager = new UserRecever();
    return (
      cookies().get("id") && (await userManager.isRole("student/isStudent"))
    );
  };
  static getDynamicValue = () => {
    const headersList = headers();
    let fullUrl = headersList.get("referer") || "";
    fullUrl = fullUrl.replace(`${urlFrontend}professorworkspace/`, "");
    const dynamicValue = fullUrl.split("/")[0];
    const text = decodeURIComponent(dynamicValue);
    return text;
  };
  static getProfessor = async () => {
    const userManager = new UserRecever();
    return await userManager.getUser("");
  };
}
