"use client";
import Image from "next/image";
import { Dispatch, FC, SetStateAction } from "react";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
const ImageProfile: FC<{
  profileImage: string;
  role: string;
  setEditMode: Dispatch<SetStateAction<boolean>>;
}> = ({ profileImage, role,setEditMode }) => {
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
    const { isUpdate } = await test.json();
    if (isUpdate) {
      setEditMode(false);
      router.refresh();
    }else
    {
      setEditMode(true);
    }
    
  };
  return (
    <div className="flex items-center justify-center w-full rounded-full w-48 h-48 relative">
      <Image
        className="rounded-full w-48 h-48"
        src={profileImage}
        alt="image description"
        width={192}
        height={192}
      />
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center rounded-full w-48 h-48 border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 absolute opacity-0 hover:opacity-100 transition-opacity duration-200"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            JPEG ONLY (MAX. 800x400px)
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={uploadImage}
        />
      </label>
    </div>
  );
};

export default ImageProfile;
