import { IconeDelete } from "@/app/IconsComponents/IconeDelete";
import IconStudentAdd from "@/app/IconsComponents/IconStudentAdd";
import IconUpdate from "@/app/IconsComponents/IconUpdate";
import { Dispatch, FC, SetStateAction } from "react";
import EntityAddModal from "./EntityAddModal";
import { CoursesName } from "../CoursesName";
import { Modal } from "flowbite-react";
import VideoUpdatePage from "./VideoUpdate";
import IconUpdateVideo from "@/app/IconsComponents/IconUpdateVideo";
export const ProfessorWorkbenchComponents: FC<{
  setCourseName: Dispatch<SetStateAction<string>>;
  courseName: string;
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>>;
  vizibility: boolean;
  // handleModel: () => void;
}> = ({ courseName, setCourseName, setDialog, vizibility }) => {

  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {courseName}
      </th>
      <td className="px-6 py-4"><p>{vizibility?"Visible":"Invisible"}</p></td>
      <td className="px-6 py-4">
        <button
          type="button"
          aria-label="Add professor"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => {
            setDialog(() => (
              <EntityAddModal
                courseName={courseName}
                EntityName={"Professor"}
                setDialog={setDialog}
              />
            ));
            setCourseName(courseName);
          }}
        >
          <IconStudentAdd />
        </button>
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          aria-label="Add students"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => {
            setDialog(() => (
              <EntityAddModal
                courseName={courseName}
                EntityName={"Student"}
                setDialog={setDialog}
              />
            ));
          }}
        >
          <IconStudentAdd />
        </button>
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          aria-label="Add students"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => {
            setDialog(() => (
              <VideoUpdatePage setDialog={setDialog} courseName={courseName}/>
            ));
          }}
        >
        <IconUpdateVideo />
        </button>
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          aria-label="update"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => {
            setDialog(() => (
              <Modal show={true} onClose={() => setDialog(undefined)}>
                <Modal.Header>Update {courseName}</Modal.Header>
                <div className="flex justify-center items-center inset-0 bg-white">
                  <CoursesName isUpdated={true} courseName={courseName} setDialog={setDialog}/>
                </div>
              </Modal>
            ));
          }}
        >
          <IconUpdate />
        </button>
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          aria-label="delete"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          onClick={() => {}}
        >
          <IconeDelete />
        </button>
      </td>
    </tr>
  );
};

export default ProfessorWorkbenchComponents;
