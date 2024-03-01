"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { TextareaInput } from "@/app/professorworkspace/[name]/video/Components/TextareaInput";
import { TitileInput } from "@/app/professorworkspace/[name]/video/Components/TitleInput";
import { UploadVideoInput } from "@/app/professorworkspace/[name]/video/Components/UploadVideoInput";
import { VideoCard } from "@/app/professorworkspace/[name]/video/VideoCard";
import { DocumentHandle } from "@/app/Entity/DocumentsHandle";
export const DocumentComponents = () => {
  const [videoDescription, setVideoDescription] = useState({
    title: "",
    filePath: "",
    description: "",
  });
  const rout: any = useRouter();
  const pathname = usePathname();
  const handePdf = async () => {
    const pathArray = pathname.split("/");
    const yourValue = pathArray[2];
    const docs = new DocumentHandle(yourValue);
    docs.sendText(videoDescription.filePath, videoDescription.title);
  };
  return (
    <>
      <VideoCard>
        <TitileInput setVideoDescription={setVideoDescription} />
        <TextareaInput setVideoDescription={setVideoDescription} />
        <UploadVideoInput setVideoDescription={setVideoDescription} />
        <button
          type="submit"
          className=" my-4 relative h-12 w-full min-w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={handePdf}
        >
          Submit
        </button>
      </VideoCard>
    </>
  );
};
