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
import { HandleGenericFunction } from "../Entity/HandleGenericFuntion";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
export const CoursesName: FC<{
  isUpdated: boolean;
  courseName: string;
  setDialog: Dispatch<SetStateAction<JSX.Element | undefined>> | undefined;
}> = ({ isUpdated, courseName, setDialog }) => {
  const [course, setCours] = useState({
    name: "",
    vizibility: false,
    description: "",
    imagePath: `${urlBackend}default/cours/1`,
    studentId: [],
    colaborationId: [],
    courses: [],
  });
  const [nameCours, setNameCours] = useState({ Name: "" });
  const [isAllRight, setIsAllRight] = useState(true);
  const rout = useRouter();
  const isId = (path: string) => {
    rout.push(`http://localhost:3001/professorworkspace/${path}`);
    rout.refresh();
  };
  function randomIntFromInterval(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  const handleUser = async (user: any) => {
    course.name = HandleGenericFunction.replaceSpaceWithUnderline(
      nameCours.Name
    );

    if (course.name && course.description) {
      setIsAllRight(true);
      course.imagePath = `${urlBackend}default/cours/${randomIntFromInterval(1,7)}`;
      const test = new Courses(user);
      const t = await test.newCourse();
      isId(t);
    } else {
      setIsAllRight(false);
    }
  };

  const handleUserUpdate = async (user: any) => {
    course.name = nameCours.Name;
    const test = new Courses(user);
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
          {!isAllRight ? (
            <Alert color="failure" icon={HiInformationCircle} className="mt-4">
              <span className="font-medium">Please fill all the fields. </span>
            </Alert>
          ) : (
            <></>
          )}
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
