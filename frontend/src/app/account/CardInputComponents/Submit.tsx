"use client";
import { FC } from "react";
import { IRegister } from "./IRegister";
interface ISubmit extends IRegister {
  handleUser: (user:any) => any;
  isEmail:boolean
}
export const Submit: FC<ISubmit> = ({ user, handleUser ,isEmail}) => {

  return (
    <>
      {isEmail && (
        <div
          className="p-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <span className="font-medium">Email is wrong</span>
        </div>
      )}

      <button
        type="submit"
        className=" my-4 relative h-12 w-full min-w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={()=>handleUser(user)}
      >
        Submit
      </button>
    </>
  );
};
