"use client";
import { FC, useState } from "react";
import { IRegister } from "../../core/IRegister";

export const InputUser: FC<IRegister> = ({ reg, setUser, user }) => {
  const[color,setColor]=useState("blue")
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  const isEmailVerify = (key: string, email: string): boolean => {
    if (key === "email") {
      return expression.test(email);
    }
    return true;
  };
  const updateState = (key: any, newValue: any) => {
    if (isEmailVerify(key, newValue)) {
      setUser((prevState: any) => ({
        ...prevState,
        [key]: newValue,
      }));
      setColor("blue");
    }else{
      setColor("red");
    }
    if(key==='Name'){
    }
  };
  return (
    <div className="w-72">
      <div className="my-8 relative h-12 w-full min-w-[200px]">
        <input
          className={`peer h-full w-full rounded-[7px] border border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal outline outline-0 transition-all placeholder-shown:border focus:border-2 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-gray-50 ${color === 'blue' ? 'border-blue-gray-200 text-blue-gray-700 placeholder-shown:border-blue-gray-200 focus:border-blue-500' : 'border-red-gray-200 text-red-gray-700 placeholder-shown:border-red-gray-200 focus:border-red-500'}`}
          placeholder=" "
          type={reg !== null ? reg : ""}
          onChange={(e) => {
            updateState(reg, e.target.value);
          }}
        />
        <label className={`before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-focus:text-[11px] peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent ${color === 'blue' ? 'text-blue-gray-500 before:border-blue-gray-200 after:border-blue-gray-200 peer-placeholder-shown:text-blue-gray-500 peer-focus:text-blue-500 peer-focus:before:border-blue-500 peer-focus:after:border-blue-500 peer-disabled:peer-placeholder-shown:blue' : 'text-red-gray-500 before:border-red-gray-200 after:border-red-gray-200 peer-placeholder-shown:text-red-gray-500 peer-focus:text-red-500 peer-focus:before:border-red-500 peer-focus:after:border-red-500 peer-disabled:peer-placeholder-shown:red'}`}>
          {reg != null ? reg.charAt(0).toUpperCase() + reg.slice(1) : ""}
        </label>
      </div>
    </div>
  );
};
