"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import { sendToServerCookies } from "../UserServer/ServerRequest";
import { useRouter } from "next/navigation";

export const UpdateTextUser: FC<{
  changeContent: string;
  url: string;
  role: string;
  email: string;
  urlApi: string;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}> = ({ changeContent, url, role, email, urlApi, setEditMode }) => {
  const route = useRouter();
  const handleUpdate = async (newValue: string) => {
    const api = await fetch(
      url,
      sendToServerCookies(
        {
          role: role,
          content: changeContent,
          newValue: newValue,
          email: email,
          urlApi: urlApi,
        },
        undefined
      )
    );
    const { isUpdate } = await api.json();
    if (isUpdate) {
      setEditMode(false);
      route.refresh()
    }
  };
  const [inputValue, setInputValue] = useState<string>("");
  return (
    <>
      <input
        type="text"
        name="username"
        placeholder="new"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        type="button"
        className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
        onClick={() => handleUpdate(inputValue)}
      >
        Update
      </button>
    </>
  );
};
