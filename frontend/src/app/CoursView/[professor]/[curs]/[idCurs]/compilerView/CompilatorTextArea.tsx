"use client";
import {FC, SetStateAction, useState } from "react";
;

const CompilatorTextArea: FC<{
  programingLanguageForrmat: string | undefined;
  handleTextareaChange: (event: any) => void;
  setProgramingLanguageForrmat: (
    value: SetStateAction<string | undefined>
  ) => void;
  handleLanguageFormat: (language: string) => Promise<string>;
  handleCompile(): Promise<void>;
}> = ({
  programingLanguageForrmat,
  handleTextareaChange,
  setProgramingLanguageForrmat,
  handleLanguageFormat,
  handleCompile,
}) => {
  return (
    <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
      <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
        <textarea
          id="message"
          rows={10}
          className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
          placeholder="Write your thoughts here..."
          value={programingLanguageForrmat}
          onChange={handleTextareaChange}
          spellCheck={false}
        ></textarea>
        <div className="flex flex-row items-center justify-between px-3 py-2 border-t dark:border-gray-600">
          <div className="flex flex-col">
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
              <option value="cpp">C++</option>
              <option value="javaScript">javaScript</option>
              <option value="java">Java</option>
            </select>
          </div>
          <div className="flex flex-col">
            <button
              type="button"
              className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
              onClick={handleCompile}
            >
              Compile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompilatorTextArea;
