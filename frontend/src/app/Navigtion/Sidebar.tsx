import { Logo } from "./logo";
import { Account } from "./Account";
import { Courses } from "./Courses";
import { ProfessorAdder } from "./ProfessorAdder";
import { EditCours } from "./EditCours";

export const Sidebar = () => {
  return (
    <div className="group">
      <aside className="side-bar group" aria-label="Sidebar">
        <div className=" h-full px-4 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <Logo />
          <ul>
            <Courses />
            <ProfessorAdder />
            <EditCours />
          </ul>
          <Account />
        </div>
      </aside>
    </div>
  );
};
