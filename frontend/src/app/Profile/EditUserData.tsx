"use client";
import { Button } from "flowbite-react";
import { FC, useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { UpdateTextUser } from "./UpdateTextUser";
const EditUserData: FC<{
  userModifyData: string;
  role: string;
  email: string;
  url: string;
  urlApi: string;
  nameOfEditor: string;
}> = ({ userModifyData, role, email, url, urlApi,nameOfEditor }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="flex items-center pb-3">
    {isHovered ? (
        <div onMouseLeave={() => setIsHovered(false)}>
            <UpdateTextUser
                changeContent={userModifyData}
                url={url}
                role={role}
                email={email}
                urlApi={urlApi}
                nameOfEditor={nameOfEditor}
                setIsHovered={setIsHovered}
            />
        </div>
    ) : (
        <p className="text-lg font-semibold ml-2">{userModifyData}</p>
    )}
      <span
        className="relative top-[-0.5em]"
        onMouseEnter={() => setIsHovered(true)}
      >
        <svg
          className="w-6 h-6 text-gray-800 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            fill-rule="evenodd"
            d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
    </div>
  );
};

export default EditUserData;