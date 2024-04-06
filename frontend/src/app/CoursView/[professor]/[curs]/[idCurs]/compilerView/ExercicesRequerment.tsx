"use client";

import { FC } from "react";

const ExercicesRequerment: FC<{
  title: string;
  problemRequire: string;
  problemExemples: string[];
}> = ({ title, problemRequire, problemExemples }) => {
  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 text-2xl ">
        {title}
      </h1>
      <p className="my-4 text-lg text-gray-500">{problemRequire}</p>
      {problemExemples.map((exemples: string, index: number) => (
        <div key={index}>
          <p className="my-4 text-lg text-gray-500">{exemples}</p>
        </div>
      ))}
    </>
  );
};

export default ExercicesRequerment;
