"use client";
import { Dispatch, FC, SetStateAction, useState } from "react";

const DropDownSearch: FC<{
  index: number;
  combineParams: string[];
  setCombineParams: Dispatch<SetStateAction<string[]>>;
  nameOfSearch: string;
}> = ({ index, combineParams, setCombineParams, nameOfSearch }) => {
  const [selectValue, setSelectValue] = useState<string[]>(["int"]);
  const [inputValue, setInputValue] = useState<string[]>([]);
  const handleSelectChange = (event: string, index: number) => {
    const newArray = [...selectValue];
    newArray[index] = event;
    setSelectValue(newArray);
  };
  const hadndleInputWithSecect = (event: string, index: number) => {
    const newArray = [...inputValue];
    newArray[index] = event;
    setInputValue(newArray);
  };
  const handleClick = (index: number) => {
    const n = [...combineParams];
    selectValue[index] =
      selectValue[index] === undefined ? "int" : selectValue[index];
    console.log("selectValue[index]: ", selectValue[index]);
    n[index] = selectValue[index] + "." + inputValue[index];
    setCombineParams(n);
  };
  return (
    <div className="flex mt-4 w-full">
      <div>
        <select
          name="ty"
          onChange={(e) => handleSelectChange(e.target.value, index)}
          className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-l-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
        >
          <option value="int">int</option>
          <option value="float">float</option>
          <option value="string">string</option>
          <option value="double">double</option>
          <option value="char">char</option>
        </select>
      </div>
      <div className="relative w-full">
        <input
          type="text"
          placeholder={nameOfSearch}
          name="problemParameter"
          onChange={(e) => hadndleInputWithSecect(e.target.value, index)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
        />
        <button
          onClick={() => handleClick(index)}
          className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default DropDownSearch;
