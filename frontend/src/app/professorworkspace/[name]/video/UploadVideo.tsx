"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import { TextareaInput } from "./Components/TextareaInput";
import { TitileInput } from "./Components/TitleInput";
import { UploadVideoInput } from "./Components/UploadVideoInput";
import { VideoCard } from "./VideoCard";
import { VideoManaging } from "../../../Entity/VideoManaging";
export const UploadVideo: FC<{
  isUpdated: boolean;
  videoName: string;
  coursName: string;
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>> | undefined;
}> = ({ isUpdated, videoName, coursName, setDialog }) => {
  const [videoDescription, setVideoDescription] = useState({
    title: "",
    filePath: "",
    description: "",
  });
  const handeNewVideo = async () => {

    const videoText: VideoManaging = new VideoManaging(coursName);
    const videoId = await videoText.sendText(
      videoDescription.title,
      videoDescription.description,
      videoDescription.filePath
    );
    // rout.push(`/professorworkspace/${yourValue}/${videoId}/video`);
  };
  const handleVideoUpdate = async () => {
    const videoText: VideoManaging = new VideoManaging(videoName);
    await videoText.sendTextUpdate(
      videoDescription.title,
      videoDescription.description,
      videoDescription.filePath,
      coursName
    );
    if (setDialog) {
      setDialog(undefined);
    }
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
          onClick={!isUpdated ? handeNewVideo : handleVideoUpdate}
        >
          Submit
        </button>
      </VideoCard>
      {/* <div className="flex justify-center items-center h-screen w-screen">
        <div className="w-full max-w-2xl p-8 bg-white border rounded-lg shadow sm:p-12 md:p-16">
          <h5 className="text-2xl font-medium text-gray-900">Upload video</h5>
          <div className="w-full grid grid-rows-3 grid-flow-col">
            <div className="col-span-2">
              <TitileInput />
            </div>
            <div className="row-span-2 col-span-2">
              <TextareaInput />
            </div>
            <div className="row-span-3 ml-4">
              <UploadVideoInput />
            </div>
            <div className="row-start-4 col-start-1 col-end-5 ">
              <button
                type="submit"
                className=" my-4 relative h-12 w-full min-w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};
