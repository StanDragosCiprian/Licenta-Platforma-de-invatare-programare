import Link from "next/link";
import { UserRecever } from "../Entity/UserRecever";

const EditProfile = async () => {
  const userManager = new UserRecever();
  const admin: any = await userManager.getUser("");
  return (
    <>
      {admin?.role === "admin" ? (
        <li className="flex flex-row">
          <Link
            href="/adminWorkspace/editEmail"
            className="flex items-center"
          >
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
            <span className="side-bar-text">Edit Profile</span>
          </Link>
        </li>
      ) : null}
    </>
  );
};

export default EditProfile;
