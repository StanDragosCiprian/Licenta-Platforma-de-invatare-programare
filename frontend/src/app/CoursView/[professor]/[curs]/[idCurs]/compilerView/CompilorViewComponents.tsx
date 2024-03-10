"use client";

import { sendToServerCookies } from "@/app/UserServer/ServerRequest";
import { FC, useEffect, useState } from "react";

export const CompilerViewComponents: FC<{
  title: string;
  problemRequire: string;
  problemExemples: string[];
  idCurs: number;
  format: "Compilator";
  professor: string;
  cursName: string;
}> = ({
  title,
  problemRequire,
  problemExemples,
  idCurs,
  professor,
  cursName,
}) => {
  const [programingLanguageForrmat, setProgramingLanguageForrmat] =
    useState<string>();
  const [programmingLanguage, setProgrammingLanguage] = useState<string>("");
  const callProgram = async () => {
    const porgamm = await handleLanguageFormat("python");
    setProgramingLanguageForrmat(porgamm);
    console.log("test");
  };
  useEffect(() => {
    callProgram();
  }, []); // Empty array means the effect runs only once after the component mounts
  const handleTextareaChange = (event: any) => {
    setProgramingLanguageForrmat(event.target.value);
  };
  const handleLanguageFormat = async (language: string): Promise<string> => {
    setProgrammingLanguage(language);
    const option = {
      language: `${language}`,
      id: `${idCurs}`,
      professor: `${professor}`,
      coursName: `${cursName}`,
    };
    const api = await fetch(
      "/api/handleExercicesApi",
      sendToServerCookies(option, undefined)
    );
    const languageFunction = await api.json();
    return languageFunction.text;
  };
  async function handleCompile(): Promise<void> {
    const option = {
      language: `${programmingLanguage}`,
      id: `${idCurs}`,
      professor: `${professor}`,
      coursName: `${cursName}`,
      script:`${programingLanguageForrmat}`
    };
    console.log(option);
    const api = await fetch(
      "/api/handleCompileApi",
      sendToServerCookies(option, undefined)
    );
  }

  return (
    <>
      <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl ">
        {title}
      </h1>
      <p className="my-4 text-lg text-gray-500">{problemRequire}</p>
      {problemExemples.map((exemples: string, index: number) => (
        <div key={index}>
          <p className="my-4 text-lg text-gray-500">{exemples}</p>
        </div>
      ))}
      <select
        id="languageProgramming"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={async (e) =>
          setProgramingLanguageForrmat(
            await handleLanguageFormat(e.target.value)
          )
        }
      >
        <option value="python">python3</option>
        <option value="python">python3</option>
        <option value="python">python3</option>
        <option value="python">python3</option>
        <option value="python">python3</option>
      </select>

      <label
        htmlFor="message"
        className="block mb-2 text-sm font-medium text-gray-900 "
      >
        Your message
      </label>
      <textarea
        id="message"
        rows={4}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Write your thoughts here..."
        value={programingLanguageForrmat}
        onChange={handleTextareaChange}
      ></textarea>
      <button
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={handleCompile}
      >
        Compile
      </button>
    </>
  );
};
