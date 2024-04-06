import { IVidePreview } from "@/app/core/IVidePreview";
import { VideoCard } from "../../professorworkspace/[name]/video/VideoCard";
// @ts-ignore
import Video from "next-video";
import { FC } from "react";
export const PreviewVideo: FC<IVidePreview> = ({
  title,
  description,
  videoPath,
}) => {
  return (
   <div className="flex justify-center items-center h-screen">
  <div className="flex flex-col w-full w-[1024px] p-8 bg-white border rounded-lg shadow">
    <div className="ml-0">
      <Video
        width={854}
        height={480}
        src={videoPath}
        primaryColor="#FFFFFF"
        accentColor="#0000FF"
      />
    </div>
    <div>
      <h2 className="text-4xl font-extrabold dark:text-white">
        {title}
      </h2>
    </div>
    <div>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  </div>
</div>
  );
};
