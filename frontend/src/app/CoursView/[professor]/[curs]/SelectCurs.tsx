import Link from "next/link";
import { Popover } from "./Popover";

export const SelectCourses = ({
  title,
  index,
  nameCours,
  coursProfessor
}: {
  title: string;
  index: number;
  nameCours: string;
  coursProfessor: string;
}) => {
  return (
    <>
      <Link
        href={`/CoursView/${coursProfessor}/${nameCours}/${index}/view`}
        className="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-300 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900 outline-none"
        data-popover-target="popover-default"
      >
        {title}
      </Link>

    </>
  );
};
