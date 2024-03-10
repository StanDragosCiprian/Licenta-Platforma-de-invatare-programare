"use client";
import {
  sendToServerCookies,
  sendToServerFile,
} from "@/app/UserServer/ServerRequest";
import { getCookie } from "cookies-next";
import { usePathname } from "next/navigation";
import { useState } from "react";
import * as XLSX from "xlsx";
export function ExercicesComponens() {
  const [exemples, setExemples] = useState(["Input:\nOutput:"]);
  const [inputs, setInputs] = useState(["Input"]);
  const [combineParams, setCombineParams] = useState<string[]>([]);
  const [exercices, setExercices] = useState<ICompilator>({
    title: "",
    problemRequire: "",
    problemExemples: [...exemples],
    problemInputs: [],
    problemOutputs: [],
    funtionProblemModel: "",
    problemParameter: "",
    urlName: "",
    format: "Compilator",
  });
  const pathname = usePathname();
  const [selectValue, setSelectValue] = useState<string[]>(["int"]);
  const [inputValue, setInputValue] = useState<string[]>([]);
  const handleExemples = () => {
    const newExemples = [...exemples, "Input:\nOutput:"];
    setExemples(newExemples);
    setExercices({
      ...exercices,
      problemExemples: newExemples,
    });
  };
  const hadndleInputWithSecect = (event: string, index: number) => {
    const newArray = [...inputValue];
    newArray[index] = event;
    setInputValue(newArray);
    console.log("newArray: ", newArray);
  };

  const handleSelectChange = (event: string, index: number) => {
    const newArray = [...selectValue];
    newArray[index] = event;
    setSelectValue(newArray);
  };
  const handleInputs = () => {
    setInputs([...inputs, "Input"]);
  };
  const [items, setItems] = useState([]);
  const readExcel = (file: any) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e: any) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, {
          type: "buffer",
        });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        let data: any = XLSX.utils.sheet_to_json(ws, { header: 1 });
        data = data[0].map((_: any, i: any) => data.map((row: any) => row[i]));
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d: any) => {
      setItems(d);
    });
  };

  const send = async () => {
    let s = "";
    combineParams.forEach((e: string) => {
      s += "," + e;
    });
    console.log("items: ", items);
    let output:string[] = [];
    let input:string[] = [];
    items.forEach((o: any) => {
      let out = [];
      let inp = [];
      for (let i = 0; i < o.length; i++) {
        if (i === 0) {
          out.push(o[i]);
          console.log(o[i]);
        } else {
          inp.push(o[i]);
          console.log(o[i]);
        }
      }
      output.push(`Output(${out})`);
      input.push(`Input(${inp})`);
    });
     const problemToSed = { ...exercices };
     problemToSed.problemParameter = s.substring(1);
     const id = getCookie("id")?.toString();
     const pathArray = pathname.split("/");
     const urlName = pathArray[2];
     problemToSed.urlName = urlName;
     problemToSed.problemOutputs=output;
     problemToSed.problemInputs=input;
     console.log('problemToSed: ', problemToSed);
     const api = await fetch(
       "/api/handleNewExercicesApi",
       sendToServerCookies(problemToSed, id)
     );
     console.log("api: ", await api.json());
  };
  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    setExercices({
      ...exercices,
      [event.target.name]: event.target.value,
    });
  };
  const handleClick = (index: number) => {
    const n = [...combineParams];
    n[index] = selectValue[index] + "." + inputValue[index];
    setCombineParams(n);
    console.log(combineParams);
  };
  const handleTextareaChange = (index: any) => (event: any) => {
    const newExemples = [...exemples];
    newExemples[index] = event.target.value;
    setExemples(newExemples);
    setExercices({
      ...exercices,
      problemExemples: newExemples,
    });
  };
  return (
    <div>
      <input
        type="text"
        name="title"
        placeholder="Problems name"
        onChange={handleInputChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <input
        type="text"
        name="problemRequire"
        placeholder="Problems Requere"
        onChange={handleInputChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      {exemples.map((exemple, index) => (
        <textarea
          key={index}
          placeholder="Exemples"
          value={exemple}
          onChange={handleTextareaChange(index)}
          cols={10}
          rows={5}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {exemple}
        </textarea>
      ))}
      <button
        type="button"
        onClick={handleExemples}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Add exemples
      </button>

      <input
        type="text"
        name="funtionProblemModel"
        placeholder="Funtion model"
        onChange={handleInputChange}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      {inputs.map((_, index: number) => (
        <>
          <input
            type="text"
            placeholder="Parameter"
            name="problemParameter"
            onChange={(e) => hadndleInputWithSecect(e.target.value, index)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <select
            name="ty"
            onChange={(e) => handleSelectChange(e.target.value, index)}
          >
            <option value="float">int</option>
            <option value="float">float</option>
            <option value="string">string</option>
            <option value="double">double</option>
            <option value="char">char</option>
          </select>
          <button
            onClick={() => handleClick(index)}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Confirm
          </button>
        </>
      ))}
      <button
        type="button"
        onClick={handleInputs}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Add input
      </button>

      <input
        type="file"
        placeholder="te"
        name="file"
        onChange={(e: any) => {
          const file = e.target.files[0];
          readExcel(file);
        }}
        required
      />
      <button
        onClick={send}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Send
      </button>
    </div>
  );
}
