import { IconeDelete } from "@/app/IconsComponents/IconeDelete";
import IconStudentAdd from "@/app/IconsComponents/IconStudentAdd";
import IconUpdate from "@/app/IconsComponents/IconUpdate";
import { Dispatch, FC, SetStateAction } from "react";
import AddStudentToCourse from "./AddStudentToCourse";
export const ProfessorWorkbenchComponents: FC<{
  CourseName: string;
  setCourseCrud: Dispatch<SetStateAction<number>>
}> = ({ CourseName,setCourseCrud }) => {
  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {CourseName}
      </th>
      <td className="px-6 py-4">
        <button
          type="button"
          aria-label="Add professor"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={()=>setCourseCrud(1)}
          
        >
          <IconStudentAdd />
        </button>
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          aria-label="Add students"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={()=>setCourseCrud(2)}
        >
          <IconStudentAdd />
        </button>
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          aria-label="update"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={()=>setCourseCrud(3)}
        >
          <IconUpdate />
        </button>
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          aria-label="delete"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          onClick={()=>setCourseCrud(4)}
        >
          <IconeDelete />
        </button>
      </td>

    </tr>
    
  );
};

export default ProfessorWorkbenchComponents;
