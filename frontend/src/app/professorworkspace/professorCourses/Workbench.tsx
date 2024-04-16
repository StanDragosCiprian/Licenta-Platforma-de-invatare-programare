"use client";
import { ICoursesAllCard } from "@/app/core/ICoursesCard";
import { FC, useState } from "react";
import ProfessorWorkbenchComponents from "./ProfessorWorkbenchComponents";

const Workbench: FC<{ professorCours: ICoursesAllCard[] }> = ({ professorCours }) => {
  const [courseName, setCourseName] = useState<string>("");
  const [dialog, setDialog] = useState<JSX.Element | undefined>(undefined);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-screen">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 text-center align-middle">
              Course Name
            </th>
              <th scope="col" className="px-6 py-3 text-center align-middle">
              Vizibility
            </th>
            <th scope="col" className="px-6 py-3 text-center align-middle">
              Add professor
            </th>
            <th scope="col" className="px-6 py-3 text-center align-middle">
              Add students
            </th>
          <th scope="col" className="px-6 py-3 text-center align-middle">
            Videos Update
            </th>
            <th scope="col" className="px-6 py-3 text-center align-middle">
            Pdf Update
            </th>
            <th scope="col" className="px-6 py-3 text-center align-middle">
            Code Update
            </th>
            <th scope="col" className="px-6 py-3 text-center align-middle">
              Update
            </th>
            <th scope="col" className="px-6 py-3 text-center align-middle">
              delete
            </th>
          </tr>
        </thead>
        <tbody>
          {professorCours.map((courses: ICoursesAllCard, index: number) => (
            <ProfessorWorkbenchComponents
              courseName={courses.title}
              key={index}
              setCourseName={setCourseName}
              setDialog={setDialog}
              vizibility={courses.vizibility}
            />
          ))}
        </tbody>
      </table>
      {dialog}
    </div>
  );
};

export default Workbench;
