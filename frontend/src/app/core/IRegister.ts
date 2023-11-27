import { Dispatch, SetStateAction } from "react";

export interface IRegister {
  registerType: string[];
  reg: string | null;
  setUser: Dispatch<SetStateAction<any>>;
  user: any;
}
