"use client";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { TextareaInput } from "@/app/professorworkspace/[name]/video/Components/TextareaInput";
import { TitileInput } from "@/app/professorworkspace/[name]/video/Components/TitleInput";
import { UploadVideoInput } from "@/app/professorworkspace/[name]/video/Components/UploadVideoInput";
import { VideoCard } from "@/app/professorworkspace/[name]/video/VideoCard";
import { DocumentHandle } from "@/app/Entity/DocumentsHandle";
export const DocumentComponents: FC<{
  isUpdated: boolean;
  documentName: string;
  coursName: string;
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>> | undefined;
  professorName: string;
  professorEmail:string;
}> = ({ isUpdated, documentName, coursName, setDialog, professorName ,professorEmail}) => {
  const [videoDescription, setVideoDescription] = useState({
    title: "",
    filePath: "",
    description: "",
  });
  const rout = useRouter();
  const handePdf = async () => {
    const docs = new DocumentHandle(coursName);
    console.log("docs: ", docs);
    const docsId=await docs.sendText(
      videoDescription.filePath,
      videoDescription.title,
      professorName
    );
    rout.push(`/CoursView/${professorEmail}/${coursName}/${docsId}/view`);
  };
  const handlePdfUpdate = async () => {
    const pdf = new DocumentHandle(coursName);
    await pdf.sendTextUpdate(
      videoDescription.filePath,
      documentName,
      videoDescription.title
    );
    if (setDialog) {
      setDialog(undefined);
    }
  };
  const handleFilePath = (e: FileList) => {
    if (e?.length) {
      setVideoDescription((v: any) => ({ ...v, filePath: e[0] }));
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col w-full w-[1024px] p-8 bg-white border rounded-lg shadow">
          <h5 className="text-2xl font-medium text-gray-900">Upload pdf</h5>
          <div className="my-4">

            <input
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Add a title to the pdf"
              required
              onChange={(e) => {
                setVideoDescription((prevState: any) => ({
                  ...prevState,
                  title: e.target.value,
                }));
              }}
            />
          </div>
          {/* <div className="relative h-20 w-full min-w-[300px]">
            <input
              className={`peer h-full w-full rounded-[7px] border border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-50   border-blue-gray-200 text-blue-gray-700 placeholder-shown:border-blue-gray-200 focus:border-blue-500`}
              placeholder=" "
              type="text"
              onChange={(e) => {
                setVideoDescription((prevState: any) => ({
                  ...prevState,
                  title: e.target.value,
                }));
              }}
            />
            <label
              className={`before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-focus:text-[11px] peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent text-blue-gray-500 before:border-blue-gray-200 after:border-blue-gray-200 peer-placeholder-shown:text-blue-gray-500 peer-focus:text-blue-500 peer-focus:before:border-blue-500 peer-focus:after:border-blue-500 peer-disabled:peer-placeholder-shown:blue`}
            >
              Title
            </label>
          </div> */}
          <div className="flex items-center justify-center w-full ">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Exel only
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleFilePath(e.target.files)
                }
              />
            </label>
          </div>
          <button
            type="submit"
            className=" my-4 relative h-12 w-full min-w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={!isUpdated ? handePdf : handlePdfUpdate}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};
