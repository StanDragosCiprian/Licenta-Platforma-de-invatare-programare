"use client";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { AccountCard } from "../account/CardInputComponents/AccountCard";
import { Submit } from "../account/CardInputComponents/Submit";
import { TextBox } from "../account/CardInputComponents/TextBox";
import { Courses } from "../Entity/Courses";
import { useRouter } from "next/navigation";
import { SelectVizibility } from "./SelectRole";
import { TextareaWithLimit } from "./TextareaWithLimit";
import { urlBackend } from "../UserServer/ServerRequest";

export const CoursesName: FC<{
  isUpdated: boolean;
  courseName: string;
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>> | undefined;
}> = ({ isUpdated, courseName, setDialog }) => {
  const [course, setCours] = useState({
    name: "",
    vizibility: false,
    description: "",
    imagePath: `${urlBackend}default/cours1`,
    studentId: [],
    colaborationId: [],
    curs: [],
  });
  const [nameCours, setNameCours] = useState({ Name: "" });
  const rout = useRouter();
  const isId = (path: string) => {
    rout.push(`http://localhost:3001/professorworkspace/${path}`);
    rout.refresh();
  };
  const handleUser = async (user: any) => {
    course.name = nameCours.Name;
    const test = new Courses(user);
    const t = await test.newCourse();
    isId(t);
  };

  const handleUserUpdate = async (user: any) => {
    course.name = nameCours.Name;
    const test = new Courses(user);
    console.log(courseName);
    const t = await test.updateCourse(courseName);
    if (setDialog) {
      setDialog(undefined);
      rout.refresh();
    }
  };
  return (
    <>
      <AccountCard name="Create courses">
        <TextBox
          registerType={["Name"]}
          reg={null}
          setUser={setNameCours}
          user={nameCours}
        >
          <SelectVizibility
            registerType={["Name"]}
            reg={null}
            setUser={setCours}
            user={course}
          />
          <TextareaWithLimit
            registerType={[]}
            reg={null}
            setUser={setCours}
            user={course}
          />
          <Submit
            registerType={[]}
            reg={null}
            setUser={setCours}
            user={course}
            handleUser={() =>
              isUpdated ? handleUserUpdate(course) : handleUser(course)
            }
          />
        </TextBox>
      </AccountCard>
    </>
  );
};
