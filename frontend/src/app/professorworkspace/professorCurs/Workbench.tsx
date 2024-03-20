"use client";
import { ICursCard } from "@/app/core/ICursCard";
import { FC, SetStateAction, useState } from "react";
import ProfessorWorkbenchComponents from "./ProfessorWorkbenchComponents";
import AddStudentToCourse from "./AddStudentToCourse";

const Workbench: FC<{ professorCours: ICursCard[] }> = ({ professorCours }) => {
    const[courseCrud,setCourseCrud]=useState<number>(0);
    const handleModel = () => {
        switch(courseCrud){
            case 0:
            return undefined
            case 1:
                return <AddStudentToCourse />
        }
    }
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Course Name
            </th>
            <th scope="col" className="px-6 py-3">
              Add professor
            </th>
            <th scope="col" className="px-6 py-3">
              Add students
            </th>
            <th scope="col" className="px-6 py-3">
              Update
            </th>
            <th scope="col" className="px-6 py-3">
              delete
            </th>
          </tr>
        </thead>
        <tbody>
          {professorCours.map((curs: ICursCard, index: number) => (
            <ProfessorWorkbenchComponents CourseName={curs.title} key={index} setCourseCrud={setCourseCrud} />
          ))}
        </tbody>
      </table>
      {handleModel()
      }
    </div>
  );
};

export default Workbench;
