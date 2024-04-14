"use client";
import { usePathname, useRouter } from "next/navigation";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { DocumentHandle } from "@/app/Entity/DocumentsHandle";
import IconCloud from "@/app/IconsComponents/IconCloud";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
export const DocumentComponents: FC<{
  isUpdated: boolean;
  documentName: string;
  coursName: string;
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>> | undefined;
  professorName: string;
  professorEmail: string;
}> = ({
  isUpdated,
  documentName,
  coursName,
  setDialog,
  professorName,
  professorEmail,
}) => {
  const [pdfDescription, setPdfDescription] = useState({
    title: "",
    filePath: "",
  });
  const rout = useRouter();
  const [isAllRight, setIsAllRight] = useState(true);
  const [warning, setWarning] = useState("");
  const handePdf = async (event: any) => {
    event.preventDefault();
    const { title, filePath } = pdfDescription;

    if (title !== "" && filePath !== "") {
      const docs = new DocumentHandle(coursName);
      const docsId = await docs.sendText(
        pdfDescription.filePath,
        pdfDescription.title,
        professorName
      );
      rout.push(`/CoursView/${professorEmail}/${coursName}/${docsId}/view`);
    } else {
      setIsAllRight(false);
      setWarning("Please fill all the fields correctly.");
    }
  };
  const handlePdfUpdate = async (event: any) => {
    event.preventDefault();
    if (!isAllRight) {
      return;
    }
    const pdf = new DocumentHandle(coursName);
    await pdf.sendTextUpdate(
      pdfDescription.filePath,
      documentName,
      pdfDescription.title
    );
    if (setDialog) {
      setDialog(undefined);
    }
  };
  const handleFilePath = (e: FileList) => {
    if (e?.length) {
      const file = e[0];
      const fileType = file.type;
      const fileSize = file.size / (1024 * 1024); // size in MB

      if (fileType !== "application/pdf") {
        setWarning("Please upload an MP4 file.");
        setIsAllRight(false);
        return;
      }

      if (fileSize > 50) {
        setWarning("The file size should not exceed 50MB.");
        setIsAllRight(false);
        return;
      }
      setIsAllRight(true);
      setPdfDescription((v: any) => ({ ...v, filePath: e[0] }));
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
                setPdfDescription((prevState: any) => ({
                  ...prevState,
                  title: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex items-center justify-center w-full ">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <IconCloud />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pdf only,Max size 50MB
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
          {!isAllRight ? (
            <Alert color="failure" icon={HiInformationCircle} className="mt-4">
              <span className="font-medium">{warning}</span>
            </Alert>
          ) : (
            <></>
          )}
          <form onSubmit={!isUpdated ? handePdf : handlePdfUpdate}>
            <button
              type="submit"
              className=" my-4 relative h-12 w-full min-w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              onClick={!isUpdated ? handePdf : handlePdfUpdate}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
