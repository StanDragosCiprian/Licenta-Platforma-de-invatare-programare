"use client";

import { FC, useState } from "react";
import { LogOut } from "./LogOut";
import { UpdateTextUser } from "./UpdateTextUser";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import ImageProfile from "./ImageProfile";
import EditUserData from "./EditUserData";

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
    setCookie("role", role);
    const test = await fetch("/api/updateProfile/handleImageProfileApi", {
      method: "POST",
      credentials: "include" as RequestCredentials,
      body: formData,
    });
    setEditMode(false);
    router.refresh();
  };
  return (
    <>
      <div className=" max-w-2xl p-8 bg-white border rounded-lg shadow sm:p-12 md:p-16">
        <ImageProfile profileImage={profileImage} role={role} />
        <EditUserData
          userModifyData={username}
          role={role}
          email={email}
          url={"/api/updateProfile/handleProfileUpdateUsername"}
          urlApi={"/update/username"}
          nameOfEditor="username"
        />
        <EditUserData
          userModifyData={email}
          role={role}
          email={email}
          url={"/api/updateProfile/handleProfileUpdateUsername"}
          urlApi={"/update/email"}
          nameOfEditor="email"
        />
        <EditUserData
          userModifyData={password}
          role={role}
          email={email}
          url={"/api/updateProfile/handleProfileUpdateUsername"}
          urlApi={"/update/password"}
          nameOfEditor="password"
        />

        <LogOut />
      </div>
    </>
  );
};
