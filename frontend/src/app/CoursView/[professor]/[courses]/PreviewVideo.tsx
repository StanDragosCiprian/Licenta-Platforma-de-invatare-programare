import { IVidePreview } from "@/app/core/IVidePreview";
// @ts-ignore
import Video from "next-video";
import { FC } from "react";
export const PreviewVideo: FC<IVidePreview> = ({
  title,
  description,
  videoPath,
}) => {
  return (
    <div className="flex  flex-col justify-center items-center ">
      <div className=" w-full w-[1024px] p-8 bg-white border rounded-lg shadow ">
        <div className="ml-0">
          <Video
            width={854}
            height={480}
            src={videoPath}
            primaryColor="#FFFFFF"
            accentColor="#5BBCFF"
          />
        </div>
        <div>
          <h2 className="text-4xl font-extrabold dark:text-white my-4 whitespace-wrap max-w-[850px]">{title}</h2>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 whitespace-wrap max-w-[850px]">{description}</p>
        </div>
      </div>
    </div>
  );
};
