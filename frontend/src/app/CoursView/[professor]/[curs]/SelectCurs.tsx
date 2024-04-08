import Link from "next/link";
import { Popover } from "./Popover";

export const SelectCourses = ({
  title,
  index,
  nameCours,
  coursProfessor,
  dragStart,
  drop,
  dragOver,
  isProfessorCours,
}: {
  title: string;
  index: number;
  nameCours: string;
  coursProfessor: string;
  isProfessorCours: boolean;
  dragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  drop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  dragOver: (e: React.DragEvent<HTMLDivElement>) => void;
}) => {
  return (
    <div className="flex items-center">
      <Link
        href={`/CoursView/${coursProfessor}/${nameCours}/${index}/view`}
        className="p-3 rounded-lg text-start leading-tight transition-all hover:bg-gray-300 focus:bg-gray-300 active:bg-gray-300 hover:text-blue-gray-900 focus:text-blue-gray-900 active:text-blue-gray-900 outline-none"
      >
        {title}
      </Link>
      {isProfessorCours && (
        <div
          draggable
          onDragStart={(e) => dragStart(e, index)}
          onDrop={(e) => drop(e, index)}
          onDragOver={dragOver}
          className="cursor-move select-none"
        >
          <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 20V7m0 13-4-4m4 4 4-4m4-12v13m0-13 4 4m-4-4-4 4"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
