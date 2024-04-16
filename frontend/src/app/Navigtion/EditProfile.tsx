import Link from "next/link";
import { UserRecever } from "../Entity/UserRecever";

const EditProfile = async () => {
  const userManager = new UserRecever();
  const admin: any = await userManager.getUser("");
  return (
    <>
      {admin?.role === "admin" ? (
        <li className="flex flex-row mb-4">
          <Link href="/adminWorkspace/editEmail" className="flex items-center">
            <svg
              className="w-6 h-6 text-[#fffbeb] mr-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 22 22"
            >
              <path
                stroke="currentColor"
                strokeLinecap="square"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z"
              />
            </svg>

            <span className="side-bar-text">Edit Profile</span>
          </Link>
        </li>
      ) : null}
    </>
  );
};

export default EditProfile;
