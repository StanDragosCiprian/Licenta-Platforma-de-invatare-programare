import { cookies, headers } from "next/headers";
import { UserRecever } from "../account/Entity/UserRecever";
import { urlFrontend } from "../UserServer/ServerRequest";

export class HandleProfessorWorkout {
  static getId = async () => {
    const userManager = new UserRecever();
    return (
      cookies().get("id") && (await userManager.isRole("admin/isProfessor"))
    );
  };
  static getDynamicValue = () => {
    const headersList = headers();
    let fullUrl = headersList.get("referer") || "";
    fullUrl = fullUrl.replace(`${urlFrontend}professorworkspace/`, "");
    const dynamicValue = fullUrl.split('/')[0];
    const text = decodeURIComponent(dynamicValue);
   console.log('fullUrl: ', text);
    return text;
  };
  
}
