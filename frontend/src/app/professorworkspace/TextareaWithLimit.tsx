import { ChangeEvent, FC, useState } from "react";
import { IRegister } from "../core/IRegister";

export const TextareaWithLimit: FC<IRegister> = ({ setUser, user }) => {
  const maxLength = 250;

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setUser((p: any) => ({ ...p, description: newValue }));
  };  

  return (
    <>
      <div className="mt-8 flex flex-col w-full max-w-md">
        <textarea
          id="textarea"
          className="resize-none px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          rows={5}
          maxLength={maxLength}
          value={user.description}
          onChange={handleInputChange}
        />
        <p id="charNum" className="text-right mt-2 text-sm text-gray-600">
          {user.description.length}/{maxLength}
        </p>
      </div>
    </>
  );
};
