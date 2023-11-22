import { Logo } from "./logo";
import { Account } from "./Account";
import { Courses } from "./Courses";
import { ProfessorAdder } from "./ProfessorAdder";
import { EditCours } from "./EditCours";
import { UserRecever } from "../account/Entity/UserRecever";
import { cookies } from "next/headers";
const getUser = async () => {
  const id: string | undefined = cookies().get("id")?.value;
  if (id !== undefined) {
    const userManager = new UserRecever();
    return await userManager.getUser("");
  }
  return "";
};
export const Sidebar = async () => {
  const user = await getUser();
  return (
    <div className="group">
      <aside className="side-bar group" aria-label="Sidebar">
        <div className=" h-full px-4 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <Logo />
          <ul>
          {user.role === "professor" ?<Courses />:null}
            {user.role === "admin" ? <ProfessorAdder /> : null}
            {user.role === "professor" ? <EditCours /> : null}
          </ul>
          <Account />
        </div>
      </aside>
    </div>
  );
};
