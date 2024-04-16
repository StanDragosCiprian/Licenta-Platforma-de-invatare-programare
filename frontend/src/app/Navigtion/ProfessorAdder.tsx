import Link from "next/link";
import { UserRecever } from "../Entity/UserRecever";

export const ProfessorAdder = async () => {
  const userManager = new UserRecever();
  const admin: any = await userManager.getUser("");
  return (
    <>
      {admin?.role === "admin" ? (
        <li className="flex flex-row mb-4">
          <Link
            href="/adminWorkspace/newProfessor"
            className="flex items-center"
          >
            <svg
              className="w-6 h-6 text-[#fffbeb] mr-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"

              fill="none"
              viewBox="0 0 22 22"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>

            <span className="side-bar-text">Add Professors</span>
          </Link>
        </li>
      ) : null}
    </>
  );
};
