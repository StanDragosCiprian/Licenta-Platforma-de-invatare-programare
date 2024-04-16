"use client";
import { Button } from "flowbite-react";
import { FC, useState } from "react";
import { IconeDelete } from "../IconsComponents/IconeDelete";
import { notFound, useRouter } from "next/navigation";
import IconUpdate from "../IconsComponents/IconUpdate";
import ReverseCourse from "./ReverseCourse";

const EmailTablr: FC<{
  students: Array<{ username: string; email: string }>;
  professor: Array<{ username: string; email: string }>;
}> = ({ students, professor }) => {
  const [switchUser, setSwutchUser] = useState<boolean>(false);
  const rout = useRouter();
  const [dialog, setDialog] = useState<JSX.Element | undefined>(undefined);
  const handleDeleteUser = async (email: string, role: string) => {
    const option = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, role: role }),
    };
    const req = await fetch("/api/handleDeleteUserApi", option);
    const { ok } = await req.json();
    if (ok) {
      rout.refresh();
    } else {
      notFound();
    }
  };

  return (
    <div className="relative overflow-x-auto w-screen">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Delete {switchUser ? "student" : "professor"} 
            </th>
            {switchUser ? undefined : (
              <th scope="col" className="px-6 py-3">
                Change course
              </th>
            )}
            <th scope="col" className="px-6 py-3">
              <Button color="purple" onClick={() => setSwutchUser(!switchUser)}>
                Switch
              </Button>
            </th>
          </tr>
        </thead>
        {switchUser ? (
          <tbody>
            {students.map(
              (e: { username: string; email: string }, index: number) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {e.username}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {e.email}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Button
                      color="red"
                      onClick={() => handleDeleteUser(e.email, "student")}
                    >
                      <IconeDelete />
                    </Button>
                  </th>
                </tr>
              )
            )}
          </tbody>
        ) : (
          <tbody>
            {professor.map(
              (e: { username: string; email: string }, index: number) => (
                <tr
                  key={index}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {e.username}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {e.email}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Button
                      color="red"
                      onClick={() => handleDeleteUser(e.email, "professor")}
                    >
                      <IconeDelete />
                    </Button>
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <Button
                      color="blue"
                      onClick={() =>
                        setDialog(
                          <ReverseCourse
                            professor={professor}
                            setDialog={setDialog}
                            email={e.email}
                            myProfessor={e.username}
                          />
                        )
                      }
                    >
                      <IconUpdate />
                    </Button>
                  </th>
                </tr>
              )
            )}
          </tbody>
        )}
      </table>
      {dialog}
    </div>
  );
};
export default EmailTablr;
