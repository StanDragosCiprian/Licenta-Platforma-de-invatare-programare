"use client";
import { ExelHandle } from "@/app/Entity/ExelHandle";
import { sendToServerCookies } from "@/app/UserServer/ServerRequest";
import { getCookie } from "cookies-next";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Button, FileInput } from "flowbite-react";
import DropDownSearch from "./DropDownSearch";
import ProblemsInput from "./ProblemsInput";
import { useRouter } from "next/navigation";
export const ExercicesComponens: FC<{
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>> | undefined;
  courseName: string;
  isUpdated: boolean;
  exercicesName: string;
  professorEmail:string;
}> = ({ setDialog, courseName, isUpdated, exercicesName,professorEmail }) => {
  const [exemples, setExemples] = useState(["Input:\nOutput:"]);
  const [inputs, setInputs] = useState<string[] | null>([]);
  const [funtionInputs, setFuntionInputs] = useState<string[]>([]);
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
  const handleExemples = () => {
    const newExemples = [...exemples, "Input:\nOutput:"];
    setExemples(newExemples);
    setExercices({
      ...exercices,
      problemExemples: newExemples,
    });
  };
  const handleInputs = () => {
    if (inputs === null) {
      setInputs(["Input"]);
    } else {
      setInputs([...inputs, "Input"]);
    }
  };
  const [items, setItems] = useState([]);
  const hndleExel = new ExelHandle();
  const finalUpdate = () => {
    let s = "";
    combineParams.forEach((e: string) => {
      s += "," + e;
    });
    let output: string[] = [];
    let input: string[] = [];
    items.forEach((o: any) => {
      let out = [];
      let inp = [];
      for (let i = 0; i < o.length; i++) {
        if (i === 0) {
          out.push(o[i]);
        } else {
          inp.push(o[i]);
        }
      }
      output.push(`Output(${out})`);
      input.push(`Input(${inp})`);
    });
    const problemToSed = { ...exercices };
    problemToSed.problemParameter = s.substring(1);
    problemToSed.urlName = courseName;
    problemToSed.problemOutputs = output;
    problemToSed.problemInputs = input;
    problemToSed.funtionProblemModel =
      funtionInputs[0] !== undefined ? funtionInputs[0] : "";
    return problemToSed;
  };
  const rout = useRouter();
  const send = async () => {
    const id = getCookie("id")?.toString();
    console.log(finalUpdate());
    const api = await fetch(
      "/api/handleNewExercicesApi",
      sendToServerCookies(finalUpdate(), id)
    );
    const{text}=await api.json();
    rout.push(`/CoursView/${professorEmail}/${courseName}/${text}/view`);
  };
  const sendUpdate = async () => {
    const id = getCookie("id")?.toString();
    const exerciesUpdate: any = finalUpdate();
    delete exerciesUpdate.urlName;
    exerciesUpdate["courseName"] = courseName;
    exerciesUpdate["oldTitle"] = exercicesName;
    const api = await fetch(
      "/api/handleUpdateCourseApi/handleUpdateExercicesApi",
      sendToServerCookies(exerciesUpdate, id)
    );
    if (setDialog !== undefined) {
      setDialog(undefined);
    }
  };
  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    setExercices({
      ...exercices,
      [event.target.name]: event.target.value,
    });
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
    
    <div className="flex overflow-auto flex-col w-full max-w-2xl  p-8 bg-white border rounded-lg shadow sm:p-12 md:p-16">
      <h5 className="text-2xl font-medium text-gray-900">Upload video</h5>
      <ProblemsInput
        handleInputChange={handleInputChange}
        nameOfInputs="Problems name"
        name="title"
      />
      <ProblemsInput
        handleInputChange={handleInputChange}
        nameOfInputs="Problems Requere"
        name="problemRequire"
      />
      {exemples.map((exemple, index) => (
        <textarea
          key={index}
          placeholder="Exemples"
          value={exemple}
          onChange={handleTextareaChange(index)}
          cols={10}
          rows={5}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-4"
        >
          {exemple}
        </textarea>
      ))}
      <Button color="blue" onClick={handleExemples} className="mt-4">
        Add exemples
      </Button>
      <DropDownSearch
        index={0}
        combineParams={funtionInputs}
        setCombineParams={setFuntionInputs}
        nameOfSearch="Funtion name"
      />
      <div>
        {inputs &&
          inputs.map((_, index: number) => (
            <DropDownSearch
              key={index}
              index={index}
              combineParams={combineParams}
              setCombineParams={setCombineParams}
              nameOfSearch="Parameters"
            />
          ))}
      </div>
      <Button color="blue" onClick={handleInputs} className="mt-4">
        Add Parameters
      </Button>
      <div>
        <FileInput
          id="file-upload"
          className="mt-4"
          onChange={(e: any) => {
            const file = e.target.files[0];
            hndleExel.readExcel(file, setItems);
          }}
        />
      </div>

      <Button
        color="blue"
        onClick={!isUpdated ? send : sendUpdate}
        className="mt-4"
      >
        Send
      </Button>
    </div>
  );
};
