"use client";
import { useState } from "react";
import { AccountCard } from "../CardInputComponents/AccountCard";
import { SelectRole } from "../CardInputComponents/SelectRole";
import { Submit } from "../CardInputComponents/Submit";
import { TextBox } from "../CardInputComponents/TextBox";

export const SignComponents = () => {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        profileImage: "z",
        role: "",
      });
  return (
    <AccountCard name="Sign In">
      <TextBox
        registerType={["username", "email", "password"]}
        reg={null}
        setUser={setUser}
        user={user}
      >
        <SelectRole
          registerType={[]}
          reg={null}
          setUser={setUser}
          user={user}
        />
        <Submit registerType={[]} reg={null} setUser={setUser} user={user} />
      </TextBox>
    </AccountCard>
  );
};
