import { cookies } from "next/headers";
import { Logo } from "./logo";
import { Account } from "./Account";
import { Courses } from "./Courses";


export const Sidebar = () => {
  return (
    <div className="group">
      <aside className="side-bar group" aria-label="Sidebar">
        <div className=" h-full px-4 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <Logo />
          <ul> <Courses /> </ul>
          <Account />
        </div>
      </aside>
    </div>
  );
};
