"use client";

import { FC, useState } from "react";
import { LogOut } from "./LogOut";
import { UpdateTextUser } from "./UpdateTextUser";
import Image from "next/image";
import { useRouter } from "next/navigation";
export const ProfileComponent: FC<{
  username: string;
  email: string;
  password: string;
  role: string;
  profileImage: string;
}> = ({ username, email, password, role, profileImage }) => {
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const router = useRouter();
  const uploadImage = async (fileInput: any) => {
    const file = fileInput.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    console.log("formData: ", formData);
    const test = await fetch("/api/updateProfile/handleImageProfileApi", {
      method: "POST",
      body: formData,
    });
    setEditMode(false);
    router.refresh();
  };
  return (
    <>
      <button
        type="button"
        onClick={() => setEditMode(!isEditMode)}
        className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
      >
        Edit
      </button>

      <Image
        className="rounded-full w-96 h-96"
        src={profileImage}
        alt="image description"
        width={96}
        height={96}
      />
      {isEditMode ? (
        <>
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            onChange={uploadImage}
          />
          <p
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
            id="file_input_help"
          >
            SVG, PNG, JPG or GIF (MAX. 800x400px).
          </p>
        </>
      ) : undefined}
      <p>
        Username:{username}
        {isEditMode ? (
          <UpdateTextUser
            changeContent={username}
            url={"/api/updateProfile/handleProfileUpdateUsername"}
            role={role}
            email={email}
            urlApi={"/update/username"}
            setEditMode={setEditMode}
          />
        ) : undefined}
      </p>
      <p>
        Email:{email}
        {isEditMode ? (
          <UpdateTextUser
            changeContent={username}
            url={"/api/updateProfile/handleProfileUpdateUsername"}
            role={role}
            email={email}
            urlApi={"/update/email"}
            setEditMode={setEditMode}
          />
        ) : undefined}
      </p>
      <p>
        Password:{password}
        {isEditMode ? (
          <UpdateTextUser
            changeContent={username}
            url={"/api/updateProfile/handleProfileUpdateUsername"}
            role={role}
            email={email}
            urlApi={"/update/password"}
            setEditMode={setEditMode}
          />
        ) : undefined}
      </p>
      <LogOut />
    </>
  );
};
