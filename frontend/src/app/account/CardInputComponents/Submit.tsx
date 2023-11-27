"use client";
import { FC } from "react";
import { IRegister } from "../../core/IRegister";
interface ISubmit extends IRegister {
  handleUser: (user:any) => any;
}
export const Submit: FC<ISubmit> = ({ user, handleUser}) => {

  return (
    <>
      <button
        type="submit"
        className=" my-4 relative h-12 w-full min-w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={handleUser}
      >
        Submit
      </button>
    </>
  );
};
