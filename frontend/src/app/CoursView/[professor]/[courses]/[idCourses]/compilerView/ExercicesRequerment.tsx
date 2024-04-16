"use client";

import Link from "next/link";
import { FC } from "react";

const ExercicesRequerment: FC<{
  title: string;
  problemRequire: string;
  problemExemples: string[];
}> = ({ title, problemRequire, problemExemples }) => {
  const detectAndRenderLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return <Link key={index} href={part} target="_blank" rel="noopener noreferrer"className="text-blue-600 hover:text-blue-800">{part}</Link>;
      }
      return part;
    });
  };
  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 text-2xl ">
        {title}
      </h1>
      <p className="my-4 text-lg text-gray-500">{problemRequire}</p>
      {problemExemples.map((exemples: string, index: number) => (
        <div key={index}>
          <p className="my-2 text-lg text-gray-500 whitespace-pre-line">{detectAndRenderLinks(exemples)}</p>
        </div>
      ))}
    </>
  );
};

export default ExercicesRequerment;
