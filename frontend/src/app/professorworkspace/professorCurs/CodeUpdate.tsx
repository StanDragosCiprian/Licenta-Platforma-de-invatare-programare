"use client";
import { Modal } from "flowbite-react";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { DocumentComponents } from "../[name]/docs/DocumentComponents";
import { ExercicesComponens } from "../[name]/exercices/ExercicesComponents";
const CodeUpdate: FC<{
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>>;
  courseName: string;
}> = ({ setDialog, courseName }) => {
  const [video, setVideo] = useState<any[]>();
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
        "/api/handleUpdateCourseApi/handleGetCompileApi",
        option
      );
      const { videos } = await req.json();
      setVideo(videos);
    };

    fetchVideo();
  }, []);
  return (
    <Modal show={true} onClose={() => setDialog(undefined)}>
      <Modal.Header>Update Pdf </Modal.Header>
      <Modal.Body>
        {videoUpdate === undefined
          ? Array.isArray(video) && (
              <ul>
                {video.map((c: any, index: number) => (
                  <li key={index}>
                    <button
                      onClick={() =>
                        setVideoUpdate(
                          <div className="w-full h-full overflow-auto">
                            <ExercicesComponens
                              setDialog={setDialog}
                              courseName={courseName}
                              isUpdated={true}
                              exercicesName={c}
                            />
                          </div>
                        )
                      }
                    >
                      {c}
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

export default CodeUpdate;
