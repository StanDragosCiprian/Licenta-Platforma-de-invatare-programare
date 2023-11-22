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
  static getDynamicValue = (rout:string) => {
    const headersList = headers();
    let fullUrl = headersList.get("referer") || "";
    const substring_to_eliminate = `${urlFrontend}professorworkspace/`;
    fullUrl = fullUrl.replace(substring_to_eliminate, "");
    return fullUrl.replace(rout,"");
  };
}
