import Image from "next/image";
import { FC } from "react";
import { CoursesName } from "./CoursesName";
export const EditCard: FC<any> = ({ imageSrc, title, content }) => {
  return (
    <>
      <div className="m-8 flex flex-col rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]  md:max-w-xl md:flex-row">
        <Image
          className="h-96 w-full rounded-t-lg object-cover md:h-auto md:w-48 md:rounded-none md:rounded-l-lg"
          src={imageSrc}
          width={1368}
          height={1368}
          alt=""
        />
        <div className="flex flex-col justify-start p-6">
          <h5 className="mb-2 text-xl font-medium text-neutral-800">
            {title}
          </h5>
          <p className="mb-4 text-base text-neutral-600 ">
            {content}
          </p>
        </div>
      </div>

    </>
  );
};
