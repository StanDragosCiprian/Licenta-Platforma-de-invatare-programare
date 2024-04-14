import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Dispatch, FC, SetStateAction } from "react";
import { IVidePreview } from "@/app/core/IVidePreview";
import { UploadVideo } from "../[name]/video/UploadVideo";
import { notFound } from "next/navigation";

const VideoUpdatePage: FC<{
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>>;
  courseName: string;
}> = ({ setDialog, courseName }) => {
  const [video, setVideo] = useState<IVidePreview[]>();
  const [videoUpdate, setVideoUpdate] = useState<JSX.Element | undefined>(
    undefined
  );
  useEffect(() => {
    const fetchVideo = async () => {
      const option = {
        method: "POST",
        credentials: "include" as RequestCredentials,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseName: courseName }),
      };
      const req = await fetch(
        "/api/handleUpdateCourseApi/handleGetUpdateVideoApi",
        option
      );
      const { videos,ok } = await req.json();
      if (!ok) notFound();
      setVideo(videos);
    };

    fetchVideo();
  }, []);

  return (
    <Modal show={true} onClose={() => setDialog(undefined)}>
      <Modal.Header>Add </Modal.Header>
      <Modal.Body>
        {videoUpdate === undefined
          ? Array.isArray(video) && (
              <ul>
                {video.map((video: IVidePreview, index: number) => (
                  <li key={index}>
                    <button
                    className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-300 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900 outline-none"
                      onClick={() =>
                        setVideoUpdate(
                          <div className="w-full h-full overflow-auto">
                            <UploadVideo
                              isUpdated={true}
                              videoName={video.title}
                              coursName={courseName}
                              setDialog={setDialog}
                              professorEmail=""
                            />
                          </div>
                        )
                      }
                    >
                      {video.title}
                    </button>
                  </li>
                ))}
              </ul>
            )
          : videoUpdate}
      </Modal.Body>
    </Modal>
  );
};

export default VideoUpdatePage;
