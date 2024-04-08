"use client";
import IconCloud from "@/app/IconsComponents/IconCloud";
import { AccountCard } from "../../account/CardInputComponents/AccountCard";
import { AdminsService } from "../../Entity/AdminService";
import { useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
export const UploadProfessor = () => {
  const [warning, setWarning] = useState([
    `You don&apos;t have the right file format!`,
  ]);
  const [files, setFiles] = useState<File | null>(null);
  const [isExel, setIsExel] = useState(false);
  const handleFileChange = async () => {
    const admin = new AdminsService();
    await admin.sendProfessor(files, setWarning, setIsExel);
  };
  const handleSetFiles = (e: any) => {
    const file = e.target.files[0];
    if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.type === "application/vnd.ms-excel"
    ) {
      setIsExel(false);
      setFiles(e.target.files[0]);
    } else {
      setIsExel(true);
    }
  };

  return (
    <>
      <AccountCard name="Upload Professor">
        <>
          <div className="flex items-center justify-center w-full my-4">
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
                  Exel only
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={handleSetFiles}
              />
            </label>
          </div>
          {isExel &&
            warning.map((warn, index) => (
              <Alert
                color="failure"
                icon={HiInformationCircle}
                key={index}
                className="mb-4"
              >
                <span className="font-medium">{warn}</span>
              </Alert>
            ))}
          <button
            type="submit"
            className=" my-4 relative h-12 w-full min-w-[200px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={() => !isExel && handleFileChange()}
          >
            Submit
          </button>
        </>
      </AccountCard>
    </>
  );
};
