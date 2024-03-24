"use client";
import { Modal } from "flowbite-react";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { DocumentComponents } from "../[name]/docs/DocumentComponents";
import { IDocument } from "@chalkbooks/react-doc-viewer";
// Replace "your-modal-package" with the actual package name

const PdfUpdate: FC<{
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
        "/api/handleUpdateCourseApi/handleGetPdfVideoApi",
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
                {video.map((video: any, index: number) => (
                  <li key={index}>
                    <button
                      onClick={() =>
                        setVideoUpdate(
                          <div className="w-full h-full overflow-auto">
                            <DocumentComponents
                              coursName={courseName}
                              setDialog={setDialog}
                              isUpdated={true}
                              documentName={video.title}
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

export default PdfUpdate;
