"use client";
import { sendToServerCookies } from "@/app/UserServer/ServerRequest";
import React, { FC } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

interface JoinCoursProps {
  professor: string;
  coursName: string;
}

export const JoinCours: FC<JoinCoursProps> = ({ professor, coursName }) => {
    const router = useRouter();
  const handleCours = async () => {
    console.log(getCookie('id'));
if(getCookie('id')!==undefined){
    const option = {
      professor: `${professor}`,
      coursName: `${coursName}`,
    };
    const api = await fetch(
      "/api/handleJoinCoursApi",
      sendToServerCookies(option, undefined)
    );
    }else{
      router.push("/account/log");
    }
    router.refresh();
  };
  return (
    <button
      type="button"
      className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
      onClick={handleCours}
    >
      Join
    </button>
  );
};
