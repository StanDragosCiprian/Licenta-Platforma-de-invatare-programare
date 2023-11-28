import { IVidePreview } from "@/app/core/IVidePreview";
import { VideoCard } from "../../professorworkspace/[name]/video/VideoCard";
// @ts-ignore
import Video from "next-video";
import { FC } from "react";
export const PreviewVideo:FC<IVidePreview> = ({title,description,videoPath}) => {
  return (
    <>
      <div className="flex justify-center items-center h-screen mx-[18vw]">
        <div className="w-full w-[1024px] p-8 bg-white border rounded-lg shadow flex flex-col md:flex-row">
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold mb-4">
              {title}
            </h2>
            <p className="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">
             {description}
            </p>
          </div>
          <div className="flex-1 ml-0 md:ml-4">
            <Video
              width={512}
              height={384}
              src={videoPath}
              primaryColor="#FFFFFF"
              accentColor="#0000FF"
            />
          </div>
        </div>
      </div>
    </>
  );
};
