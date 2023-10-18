"use client";
import { FC, useState } from "react";
import { IRegister } from "./IRegister";
import { Student } from "../Entity/Student";
import { setCookie, getCookie } from "cookies-next";
import { useRouter } from "next/dist/client/components/navigation";
import Link from "next/link";

export const Submit: FC<IRegister> = ({ user }) => {
  let entity: any = null;
  let [isEmail, setIsEmail]: any = useState(true);
  const rout: any = useRouter();
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const handleUser = () => {
    if (user.role === "Student") {
      const emailIsValid = expression.test(user.email);
      setIsEmail(emailIsValid);
      if (!isEmail) {
        entity = new Student(user);
        entity.NewStudent().then((id: string) => {
          setCookie("id", id);
          rout.push("/");
        });
      }
    } else if (user.role === "Professor") console.log(user);
  };
  return (
    <>
      {!isEmail && (
        <div
          className="p-4 mt-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <span className="font-medium">Email is wrong</span> 
        </div>
      )}
      <Link href="/account/log" className="mt-4 inline-block font-medium text-blue-600 dark:text-blue-500 hover:underline hover:text-red-600">Do you have a account?</Link>
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
