"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import {urlFrontend } from "../UserServer/ServerRequest";
export const SelectCours: FC<any> = ({ allCours }) => {
  const router = useRouter();
  const handleChange = (event: any) => {
    const selectedCourse = event.target.value;

    router.push(`${urlFrontend}professorworkspace/${selectedCourse}`);
  };
  return (
    <select
      className="ml-4 side-bar-text bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      onChange={handleChange}
    >
      <option selected>Choose a cours</option>
      {allCours.map((cours: string, index: number) => (
        <option key={index} value={cours}>
          {cours}
        </option>
      ))}
    </select>
  );
};
