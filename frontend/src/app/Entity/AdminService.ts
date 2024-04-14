import { sendFiles, urlBackend } from "@/app/UserServer/ServerRequest";
import { Dispatch, SetStateAction } from "react";

export class AdminsService {
  public async sendProfessor(
    file: any,
    setWarning: Dispatch<SetStateAction<string[]>>,
    setIsExel: Dispatch<SetStateAction<boolean>>,
    id:string|undefined
  ) {
    const exel=new FormData();
    exel.set("file",file);
    const res = await fetch(`${urlBackend}admin/exel`, sendFiles(exel,id));
    const z = await res.json();
    if (typeof z !== "boolean") {
      setWarning(z);
      setIsExel(true);
    }
  }
}
