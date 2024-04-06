"use client";

import { sendToServerCookies } from "@/app/UserServer/ServerRequest";
import { FC, useEffect, useState } from "react";
import ExercicesRequerment from "./ExercicesRequerment";
import CompilatorTextArea from "./CompilatorTextArea";
import FailAlert from "./FailAlert";
import SuccessAlert from "./SuccessAlert";
import LoadingStatus from "./LoadingStatus";
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
  const [statusOfCode, setStatusOfCode] = useState<IStatutCode>();
  const [isStarted, setIsStarted] = useState<boolean>(false);
  async function handleCompile(): Promise<void> {
    const option = {
      language: `${programmingLanguage}`,
      id: `${idCurs}`,
      professor: `${professor}`,
      coursName: `${cursName}`,
      script: `${programingLanguageForrmat}`,
    };
    setIsStarted(true);
    const api = await fetch(
      "/api/handleCompileApi",
      sendToServerCookies(option, undefined)
    );
    const response = await api.json();
    setStatusOfCode(response);
    setIsStarted(true);
  }
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
