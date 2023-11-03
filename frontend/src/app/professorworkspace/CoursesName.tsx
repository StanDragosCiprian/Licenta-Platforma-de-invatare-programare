"use client";
import { useState } from "react";
import { AccountCard } from "../account/CardInputComponents/AccountCard";
import { Submit } from "../account/CardInputComponents/Submit";
import { TextBox } from "../account/CardInputComponents/TextBox";
import { Courses } from "../account/Entity/Courses";
import { useRouter } from "next/navigation";

export const CoursesName = () => {
  const [user, setUser] = useState({
    Name: "",
    studentId: [],
    colaborationId: [],
    curs: [],
  });
  const rout = useRouter();
  const isId = () => {
    rout.push("/");
    rout.refresh();
  };
  const handleUser = async (user: any) => {
    const test = new Courses(user);
    const t = await test.newCourse();

  };
  return (
    <>
      <AccountCard name="Create courses">
        <TextBox
          registerType={["Name"]}
          reg={null}
          setUser={setUser}
          user={user}
        >
          <Submit
            registerType={[]}
            reg={null}
            setUser={setUser}
            user={user}
            handleUser={handleUser}
          />
        </TextBox>
      </AccountCard>
    </>
  );
};
