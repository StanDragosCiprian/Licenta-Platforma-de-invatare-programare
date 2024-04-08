import { IconeDelete } from "@/app/IconsComponents/IconeDelete";
import IconStudentAdd from "@/app/IconsComponents/IconStudentAdd";
import IconUpdate from "@/app/IconsComponents/IconUpdate";
import { Dispatch, FC, SetStateAction } from "react";
import EntityAddModal from "./EntityAddModal";
import { CoursesName } from "../CoursesName";
import { Modal } from "flowbite-react";
import VideoUpdatePage from "./VideoUpdate";
import IconUpdateVideo from "@/app/IconsComponents/IconUpdateVideo";
import IconPdf from "@/app/IconsComponents/IconPdf";
import PdfUpdate from "./PdfUpdate";
import IconCode from "@/app/IconsComponents/IconCode";
import CodeUpdate from "./CodeUpdate";
import DeleteCourse from "./DeleteCourse";
import { HandleGenericFuntion } from "@/app/Entity/HandleGenericFuntion";
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
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center align-middle"
      >
        {HandleGenericFuntion.replaceUnderlineWithSpace(courseName)}
      </th>
      <td className="px-6 py-4 text-center align-middle">
        <p>{vizibility ? "Visible" : "Invisible"}</p>
      </td>
      <td className="px-6 py-4 text-center align-middle">
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
      <td className="px-6 py-4 text-center align-middle">
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
      <td className="px-6 py-4 text-center align-middle">
        <button
          type="button"
          aria-label="Add students"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => {
            setDialog(() => (
              <VideoUpdatePage setDialog={setDialog} courseName={courseName} />
            ));
          }}
        >
          <IconUpdateVideo />
        </button>
      </td>
      <td className="px-6 py-4 text-center align-middle">
        <button
          type="button"
          aria-label="Add students"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => {
            setDialog(() => (
              <PdfUpdate setDialog={setDialog} courseName={courseName} />
            ));
          }}
        >
          <IconPdf />
        </button>
      </td>
      <td className="px-6 py-4 text-center align-middle">
        <button
          type="button"
          aria-label="Add students"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => {
            setDialog(() => (
             <CodeUpdate setDialog={setDialog} courseName={courseName} />
            ));
          }}
        >
          <IconCode />
        </button>
      </td>
      <td className="px-6 py-4 text-center align-middle">
        <button
          type="button"
          aria-label="update"
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          onClick={() => {
            setDialog(() => (
              <Modal show={true} onClose={() => setDialog(undefined)}>
                <Modal.Header>Update {courseName}</Modal.Header>
                <div className="flex justify-center items-center inset-0 bg-white">
                  <CoursesName
                    isUpdated={true}
                    courseName={courseName}
                    setDialog={setDialog}
                  />
                </div>
              </Modal>
            ));
          }}
        >
          <IconUpdate />
        </button>
      </td>
      <td className="px-6 py-4 text-center align-middle">
        <button
          type="button"
          aria-label="delete"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 "
          onClick={() => {
            setDialog(() => (
              <DeleteCourse
                courseName={courseName}
                EntityName={"Course"}
                setDialog={setDialog}
              />
            ));
          }}
        >
          <IconeDelete />
        </button>
      </td>
    </tr>
  );
};

export default ProfessorWorkbenchComponents;
