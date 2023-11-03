import Link from "next/link";
import { UserRecever } from "../account/Entity/UserRecever";

export const Courses = async () => {
  const userManager=new UserRecever();
  const professor:any=await userManager.getUser("");
  return (
    <>
      {professor?.role === "professor" ? (
        <li className="flex flex-row">
          <Link href="/professorworkspace" className="flex items-center">
            <svg
              className="w-6 h-6 text-gray-500 mr-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 5.757v8.486M5.757 10h8.486M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span className=" hidden group-hover:block hover:opacity-100 self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Create course
            </span>
          </Link>
        </li>
      ) : null}
    </>
  );
};
