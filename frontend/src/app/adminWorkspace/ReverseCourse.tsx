"use client";
import { Button, Modal } from "flowbite-react";
import { Dispatch, FC, SetStateAction, useState } from "react";

const ReverseCourse: FC<{
  professor: Array<{ username: string; email: string }>;
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>>;
  email: string;
}> = ({ professor, setDialog, email }) => {
  const [selected, setSelected] = useState<string>("");
  const handleSwitchProfessorCourse = async (
    email1: string,
    email2: string
  ) => {
    const option = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email1: email1, email2: email2 }),
    };
    await fetch("/api/handleSwitchProfessorCourseApi", option);
  };
  return (
    <Modal show={true} onClose={() => setDialog(undefined)}>
      <Modal.Header>Swich professor course </Modal.Header>
      <Modal.Body>
        <label
          htmlFor="countries"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select an option
        </label>
        <select
          id="countries"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={(e) => setSelected(e.target.value)}
        >
          <option disabled selected>
            Switch courses
          </option>
          {professor.map((professor, index) =>
            professor.email !== email ? (
              <option key={index} value={professor.email}>
                {professor.username}
              </option>
            ) : undefined
          )}
        </select>
        <Button color="blue" onClick={() => handleSwitchProfessorCourse(selected,email)}>
          Switch course
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ReverseCourse;
