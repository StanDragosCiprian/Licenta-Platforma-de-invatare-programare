import { ItemList } from "./ItemList";
import { cookies } from 'next/headers'
import { Logo } from "./logo";
import { Account } from "./Account";
export const Sidebar = () => {
  console.log(cookies().get('id'))
  return (
    <div className="group">
      <aside className="side-bar group" aria-label="Sidebar">
        <div className=" h-full px-4 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <Logo />
          <Account />
        </div>
      </aside>
    </div>
  );
};
