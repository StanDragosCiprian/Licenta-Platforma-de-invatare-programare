"use client"
import { FC } from "react";
import { IRegister } from "./IRegister";

export const SelectRole: FC<IRegister> = ({ setUser, user }) => {
  return (
    <select
      value={user.role}
      className="h-12 bg-gray-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:border-blue-500"
      onChange={(e) => {
        setUser((z: any) => ({ ...z, ["role"]: e.target.value }));
      }}
    >
      <option disabled value="">
        What are you
      </option>
      <option value="Student">Student</option>
      <option value="Professor">Professor</option>
    </select>
  );
};
