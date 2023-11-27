import Link from "next/link";
import Image from "next/image";
import { ICursCard } from "../core/ICursCard";
import { FC } from "react";
export const CoursCard:FC<ICursCard> = ({title,image,description}) => {
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
          <Link href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
              {title}
            </h5>
          </Link>
          <p className="mb-3 font-normal text-gray-700">
          {description}
          </p>
        </div>
      </div>
    </>
  );
};
