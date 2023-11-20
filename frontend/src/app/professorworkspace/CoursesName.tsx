"use client";
import { useState } from "react";
import { AccountCard } from "../account/CardInputComponents/AccountCard";
import { Submit } from "../account/CardInputComponents/Submit";
import { TextBox } from "../account/CardInputComponents/TextBox";
import { Courses } from "../account/Entity/Courses";
import { useRouter } from "next/navigation";
import { SelectVizibility } from "./SelectRole";

export const CoursesName = () => {
  const [course, setCours] = useState({
    name: "",
    vizibility: false,
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
          <Submit
            registerType={[]}
            reg={null}
            setUser={setCours}
            user={course}
            handleUser={() => handleUser(course)}
          />
        </TextBox>
      </AccountCard>
    </>
  );
};
