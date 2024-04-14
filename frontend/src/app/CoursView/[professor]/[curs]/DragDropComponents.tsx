"use client";

import { CoursManager } from "@/app/Entity/CoursManager";
import { SelectCourses } from "./SelectCurs";
import { useState } from "react";
import { Popover } from "./Popover";
export const DragDropComponenst = ({
  courseTitles,
  coursName,
  coursProfessor,
  isProfessorCours,
  format,
}: {
  courseTitles: string[];
  coursName: string;
  coursProfessor: string;
  isProfessorCours: boolean;
  format:string[];
}) => {
  const [courses, setCourses] = useState(courseTitles);

  const dragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData("draggedItemIndex", index.toString());
  };

  const drop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();

    const draggedItemIndex = e.dataTransfer.getData("draggedItemIndex");

    if (draggedItemIndex) {
      const cours = new CoursManager();
      cours.changeIndexCours(coursName, draggedItemIndex, index.toString());
      const newCourses = [...courses];
      const temp = newCourses[index];
      newCourses[index] = newCourses[parseInt(draggedItemIndex)];
      newCourses[parseInt(draggedItemIndex)] = temp;

      setCourses(newCourses);
    }
  };
  const dragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  return (
    <>
      {courses.map((title: string, index: number) => (
        <div key={index}>
          <SelectCourses
            title={title}
            index={index}
            nameCours={coursName}
            coursProfessor={coursProfessor}
            dragStart={dragStart}
            drop={drop}
            dragOver={dragOver}
            isProfessorCours={isProfessorCours}
            format={format[index]}
          />
        </div>
      ))}
    </>
  );
};
