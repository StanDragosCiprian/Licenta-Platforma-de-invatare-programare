import { FC } from "react";
import { IRegister } from "../account/CardInputComponents/IRegister";

export const SelectVizibility: FC<IRegister> = ({ setUser, user }) => {
  return (
    <select
      value={user.vizibility ? "Public" : "Private"}
      className="h-12 bg-gray-50 border border-gray-300 text-black-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:focus:border-blue-500"
      onChange={(e) => {
        e.target.value === "Public"
          ? setUser({ ...user, vizibility: true })
          : setUser({ ...user, vizibility: false });
      }}
    >
      <option disabled value="">
        How to be courses your courses
      </option>
      <option value="Public">Public</option>
      <option value="Private">Private</option>
    </select>
  );
};
