"use client";

import { CoursManager } from "@/app/Entity/CoursManager";
import { SelectCourses } from "./SelectCurs";
import { useState } from "react";
import { Popover } from "./Popover";
export const DragDropComponenst = ({
  courseTitles,
  coursName,
  coursProfessor,
}: {
  courseTitles: string[];
  coursName: string;
  coursProfessor: string;
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
  console.log(courses);
  return (
    <>
      {courses.map((title: string, index: number) => (
        <div
          draggable
          onDragStart={(e) => dragStart(e, index)}
          onDrop={(e) => drop(e, index)}
          onDragOver={dragOver}
          key={index}
          className="cursor-move select-none"
        >
          <SelectCourses title={title} index={index} nameCours={coursName} coursProfessor={coursProfessor}/>
        </div>
      ))}
    </>
  );
};
