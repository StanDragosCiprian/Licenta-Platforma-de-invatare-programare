"use client";

import { ExelHandle } from "@/app/Entity/ExelHandle";
import { HandleGenericFuntion } from "@/app/Entity/HandleGenericFuntion";
import { getCookie } from "cookies-next";
import { Alert, Button, FileInput, Label, Modal } from "flowbite-react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { HiInformationCircle } from "react-icons/hi";
const EntityAddModal: FC<{
  courseName: string;
  EntityName: string;
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>>;
}> = ({ courseName, EntityName, setDialog }) => {
  const [studentEmail, setStudentEmail] = useState([[]]);
  const [isAllRight, setIsAllRight] = useState(true);
  const handleAddStudent = async () => {
    const option = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
        Cookie: `id=${getCookie("id")}`,
      },
      body: JSON.stringify({
        studentsEmail: studentEmail.filter((value: any) => value !== null),
        courseName: courseName,
        grad: EntityName,
      }),
    };
    const req = await fetch("/api/handleUpdateStudentsToCourse/", option);
    const { ok } = await req.json();
    if (!ok) {
      setIsAllRight(false);
      return;
    }
    setIsAllRight(true);
    setDialog(undefined);
  };
  return (
    <>
      <Modal show={true} onClose={() => setDialog(undefined)}>
        <Modal.Header>
          Add {EntityName} to{" "}
          {HandleGenericFuntion.replaceUnderlineWithSpace(courseName)}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Welcome to the {EntityName} addition feature. Here, you can add
              multiple {EntityName} to the system in a quick and efficient
              manner.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              To do this, simply upload an Excel file. The first column of this
              file should be filled with the email addresses of the {EntityName}{" "}
              you wish to add. Once uploaded, the system will automatically
              process the file and add the {EntityName} to the database.
            </p>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="file-upload" value="Upload file" />
            </div>
            <FileInput
              id="file-upload"
              onChange={async (e: any) => {
                const file = e.target.files[0];
                const handleExel = new ExelHandle();
                await handleExel.readExcelEmail(file, setStudentEmail);
              }}
            />
            {!isAllRight && (
              <Alert
                color="failure"
                icon={HiInformationCircle}
                className="mt-4"
              >
                <span className="font-medium">{EntityName} didn&apos;t exist</span>
              </Alert>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddStudent}>Add</Button>
          <Button color="gray" onClick={() => setDialog(undefined)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EntityAddModal;
