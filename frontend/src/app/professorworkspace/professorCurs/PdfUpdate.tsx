"use client";
import { Modal } from "flowbite-react";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { DocumentComponents } from "../[name]/docs/DocumentComponents";
import { IDocument } from "@chalkbooks/react-doc-viewer";
import { notFound } from "next/navigation";
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
      const { videos,ok } = await req.json();
      if(ok)
      setVideo(videos);
    else notFound();
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
                    className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-300 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900 outline-none"
                      onClick={() =>
                        setVideoUpdate(
                          <div className="w-full h-full overflow-auto">
                            <DocumentComponents
                              coursName={courseName}
                              setDialog={setDialog}
                              isUpdated={true}
                              documentName={video.title}
                              professorName=""
                              professorEmail="" // Add the missing professorEmail property
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
