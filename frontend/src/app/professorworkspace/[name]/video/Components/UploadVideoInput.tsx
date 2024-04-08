import { Dispatch, FC, SetStateAction } from "react";
import { IVideoDescription } from "../VideoInterfaces";
import IconCloud from "@/app/IconsComponents/IconCloud";
export const UploadVideoInput: FC<
  IVideoDescription & {
    setWarning: Dispatch<SetStateAction<string>>;
    setIsAllRight: Dispatch<SetStateAction<boolean>>;
  }
> = ({ setVideoDescription, setWarning, setIsAllRight }) => {
  const handleFilePath = (e: any) => {
    if (e?.length) {
      const file = e[0];
      const fileType = file.type;
      const fileSize = file.size / (1024 * 1024); // size in MB

      if (fileType !== "video/mp4") {
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
      setVideoDescription((v: any) => ({ ...v, filePath: file }));
    }
  };

  return (
    <>
      <div className="flex items-center justify-center w-full ">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50   hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <IconCloud />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span>
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              MP4 only,Max size 50MB
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={(e: any) => handleFilePath(e.target.files)}
          />
        </label>
      </div>
    </>
  );
};
