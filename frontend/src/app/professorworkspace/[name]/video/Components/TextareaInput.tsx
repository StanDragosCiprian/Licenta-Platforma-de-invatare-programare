import { FC } from "react";
import { IVideoDescription } from "../VideoInterfaces";

export const TextareaInput: FC<IVideoDescription> = ({
  setVideoDescription,
}) => {
  return (
    <>
      <textarea
        id="message"
        rows={7}
        className="mt-2 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Write your thoughts here..."
        onChange={(e) => {
          setVideoDescription((prevState: any) => ({
            ...prevState,
            description: e.target.value,
          }));
        }}
      ></textarea>
    </>
  );
};
