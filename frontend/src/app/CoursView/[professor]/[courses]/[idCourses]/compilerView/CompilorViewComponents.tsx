"use client";

import { sendToServerCookies } from "@/app/UserServer/ServerRequest";
import { FC, useEffect, useState } from "react";
import ExercicesRequerment from "./ExercicesRequerment";
import CompilatorTextArea from "./CompilatorTextArea";
import FailAlert from "./FailAlert";
import SuccessAlert from "./SuccessAlert";
import LoadingStatus from "./LoadingStatus";
import { notFound } from "next/navigation";
export interface IStatutCode {
  isAlgorithmOk: boolean;
  input: string;
  yourOutput: string;
  expected: string;
}
export const CompilerViewComponents: FC<{
  title: string;
  problemRequire: string;
  problemExemples: string[];
  idCourses: number;
  format: "Compilator";
  professor: string;
  courseName: string;
}> = ({
  title,
  problemRequire,
  problemExemples,
  idCourses,
  professor,
  courseName,
}) => {
  const [programingLanguageForrmat, setProgramingLanguageForrmat] =
    useState<string>();
  const [programmingLanguage, setProgrammingLanguage] = useState<string>("");
  const callProgram = async () => {
    const porgamm = await handleLanguageFormat("python");
    setProgramingLanguageForrmat(porgamm);
  };
  useEffect(() => {
    callProgram();
  }, []);
  const handleTextareaChange = (event: any) => {
    setProgramingLanguageForrmat(event.target.value);
  };
  const handleLanguageFormat = async (language: string): Promise<string> => {
    setProgrammingLanguage(language);
    const option = {
      language: `${language}`,
      id: `${idCourses}`,
      professor: `${professor}`,
      coursName: `${courseName}`,
    };
    const api = await fetch(
      "/api/handleExercicesApi",
      sendToServerCookies(JSON.stringify(option), undefined)
    );
    const { text, ok } = await api.json();
    if (ok) {
      return text.replace('undefined', '');
    } else {
      notFound();
    }
  };
  const [statusOfCode, setStatusOfCode] = useState<IStatutCode>();
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const handleCompile = async (): Promise<void> => {
    setIsStarted(true);
    setStatusOfCode(undefined);
    const option = {
      language: `${programmingLanguage}`,
      id: `${idCourses}`,
      professor: `${professor}`,
      coursName: `${courseName}`,
      script: `${programingLanguageForrmat}`,
    };

    try {
      const api = await fetch(
        "/api/handleCompileApi",
        sendToServerCookies(JSON.stringify(option), undefined)
      );
      const response = await api.json();
      setStatusOfCode(response);
    } catch (error) {
      notFound();
    } finally {
      setIsStarted(false);
    }
  };
  return (
    <div className="flex flex-wrap overflow-hidden flex-row p-8 bg-white border rounded-lg shadow sm:p-12 md:p-16 w-screen h-screen">
      <div className="flex flex-col overflow-auto w-1/2 h-screen">
        <ExercicesRequerment
          title={title}
          problemRequire={problemRequire}
          problemExemples={problemExemples}
        />
      </div>
      <div className="flex flex-col w-1/2 h-screen">
        <CompilatorTextArea
          programingLanguageForrmat={programingLanguageForrmat}
          handleTextareaChange={handleTextareaChange}
          setProgramingLanguageForrmat={setProgramingLanguageForrmat}
          handleLanguageFormat={handleLanguageFormat}
          handleCompile={handleCompile}
        />
        {statusOfCode !== undefined ? (
          statusOfCode.isAlgorithmOk === true ? (
            <SuccessAlert />
          ) : (
            <FailAlert statusOfCode={statusOfCode} />
          )
        ) : isStarted ? (
          <LoadingStatus />
        ) : undefined}
      </div>
    </div>
  );
};
