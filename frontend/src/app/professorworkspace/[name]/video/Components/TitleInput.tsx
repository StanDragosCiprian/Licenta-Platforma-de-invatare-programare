import { FC } from "react";
import { IVideoDescription } from "../VideoInterfaces";

export const TitileInput: FC<IVideoDescription> = ({ setVideoDescription }) => {
  return (
    <>
      <div className="relative h-20 w-full min-w-[300px]">
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
      </div>
    </>
  );
};
