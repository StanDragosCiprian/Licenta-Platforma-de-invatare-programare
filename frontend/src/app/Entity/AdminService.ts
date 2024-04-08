import { sendFiles, urlBackend } from "@/app/UserServer/ServerRequest";
import { Dispatch, SetStateAction } from "react";

export class AdminsService {
  public async sendProfessor(
    file: any,
    setWarning: Dispatch<SetStateAction<string[]>>,
    setIsExel: Dispatch<SetStateAction<boolean>>
  ) {
    const res = await fetch(`${urlBackend}admin/exel`, sendFiles(file));
    const z = await res.json();
    console.log("z: ", z);
    if (typeof z !== "boolean") {
      setWarning(z);
      setIsExel(true);
    }
  }
}
