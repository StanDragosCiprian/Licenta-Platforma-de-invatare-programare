import Link from "next/link";
import Image from "next/image";
import { ICourseCard } from "../core/ICoursesCard";
import { FC } from "react";

export const CoursCard: FC<ICourseCard> = ({
  title,
  image,
  description,
  professor,
}) => {
  return (
    <>
      <div className="m-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow">
        <Image
          className="rounded-t-lg w-full h-auto"
          src={image}
          width={1080}
          height={1980}
          alt=""
        />

        <div className="p-5">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
            {title}
          </h5>
          <p className="mb-3 font-normal text-gray-700 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[25ch]">{description}</p>
        </div>
      </div>
    </>
  );
};
