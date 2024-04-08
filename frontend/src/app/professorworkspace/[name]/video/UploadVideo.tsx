"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import { TextareaInput } from "./Components/TextareaInput";
import { TitileInput } from "./Components/TitleInput";
import { UploadVideoInput } from "./Components/UploadVideoInput";
import { VideoCard } from "./VideoCard";
import { VideoManaging } from "../../../Entity/VideoManaging";
import { useRouter } from "next/navigation";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
export const UploadVideo: FC<{
  isUpdated: boolean;
  videoName: string;
  coursName: string;
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>> | undefined;
  professorEmail: string;
}> = ({ isUpdated, videoName, coursName, setDialog, professorEmail }) => {
  const [videoDescription, setVideoDescription] = useState({
    title: "",
    filePath: "",
    description: "",
  });
  const rout = useRouter();
  const [isAllRight, setIsAllRight] = useState(true);
  const [warning, setWarning] = useState("");
  const handeNewVideo = async () => {
    const { title, description, filePath } = videoDescription;
    if (title !== "" && description !== "" && filePath !== "") {
      const videoText: VideoManaging = new VideoManaging(coursName);
      const videoId = await videoText.sendText(title, description, filePath);
      rout.push(`/CoursView/${professorEmail}/${coursName}/${videoId}/view`);
    } else {
      setIsAllRight(false);
      setWarning("Please fill all the fields correctly.");
    }
  };
  const handleVideoUpdate = async () => {
    if(!isAllRight){
      return;
    }
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
        <UploadVideoInput
          setVideoDescription={setVideoDescription}
          setWarning={setWarning}
          setIsAllRight={setIsAllRight}
        />
        {!isAllRight ? (
          <Alert color="failure" icon={HiInformationCircle} className="mt-4">
            <span className="font-medium">{warning}</span>
          </Alert>
        ) : (
          <></>
        )}
        <button
          type="submit"
          className=" my-4 relative h-12 w-full min-w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={!isUpdated ? handeNewVideo : handleVideoUpdate}
        >
          Submit
        </button>
      </VideoCard>
    </>
  );
};
