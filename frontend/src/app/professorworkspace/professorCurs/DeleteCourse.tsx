"use client";
import { ExelHandle } from "@/app/Entity/ExelHandle";
import { Button, FileInput, Label, Modal } from "flowbite-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
const DeleteCourse: FC<{
  courseName: string;
  EntityName: string;
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>>;
}> = ({ courseName, EntityName, setDialog }) => {
  const [studentEmail, setStudentEmail] = useState([[]]);
  const route = useRouter();
  const handleAddStudent = async () => {
    const option = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseName: courseName,
      }),
    };
    const req = await fetch("/api/handleDeleteCourse/", option);
    setDialog(undefined);
    // Declare the 'route' variable
    route.refresh(); // Use the 'route' variable
  };
  return (
    <>
      <Modal show={true} onClose={() => setDialog(undefined)}>
        <Modal.Header>
          Add {EntityName} to {courseName}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <Button color="red" onClick={handleAddStudent}>
              Add
            </Button>
            <Button color="gray" onClick={() => setDialog(undefined)}>
              Decline
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DeleteCourse;
