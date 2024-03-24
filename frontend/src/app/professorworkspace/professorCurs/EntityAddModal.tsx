"use client";

import { ExelHandle } from "@/app/Entity/ExelHandle";
import { Button, FileInput, Label, Modal } from "flowbite-react";
import { Dispatch, FC, SetStateAction, useState } from "react";

const EntityAddModal: FC<
 {
    courseName: string;
    EntityName: string;
    setDialog: Dispatch<SetStateAction<JSX.Element | undefined>>;
  }
> = ({  courseName, EntityName, setDialog }) => {
  const [studentEmail, setStudentEmail] = useState([[]]);
  const handleAddStudent = async () => {
    const option = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentsEmail: studentEmail.filter((value: any) => value !== null),
        courseName: courseName,
        grad: EntityName,
      }),
    };
    const req = await fetch("/api/handleUpdateStudentsToCourse/", option);
    console.log(await req.json());
  };
  return (
    <>
      <Modal
        show={true}
        onClose={() => setDialog(undefined)}
      >
        <Modal.Header>Add {EntityName} to {courseName}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              With less than a month to go before the European Union enacts new
              consumer privacy laws for its citizens, companies around the world
              are updating their terms of service agreements to comply.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.)
              goes into effect on May 25 and is meant to ensure a common set of
              data rights in the European Union. It requires organizations to
              notify users as soon as possible of high-risk data breaches that
              could personally affect them.
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
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleAddStudent}>Add</Button>
          <Button
            color="gray"
            onClick={() => setDialog(undefined)}
          >
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EntityAddModal;
