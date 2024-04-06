"use client";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";


export const LogOut = () => {
  const router = useRouter();

  const handleLogOut = () => {
    deleteCookie("id");
    router.refresh();
    router.push("/");
  };

  return (
    <button type="button" onClick={handleLogOut} className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
      Log out
    </button>
  );
};
