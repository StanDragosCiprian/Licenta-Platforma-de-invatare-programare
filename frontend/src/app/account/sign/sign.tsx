"use client";
import { useState } from "react";
import { AccountCard } from "../CardInputComponents/AccountCard";
import { SelectRole } from "../CardInputComponents/SelectRole";
import { Submit } from "../CardInputComponents/Submit";
import { TextBox } from "../CardInputComponents/TextBox";
import { RedirectComponents } from "../CardInputComponents/RedirectComponents";
import { UserAuthenticationManager } from "../Entity/UserAuthenticationManager";

export const SignComponents = () => {
  let [isEmail, setIsEmail]: any = useState(false);
  const userAutentification=new UserAuthenticationManager();
  const handleUser = (user: any) => {
    if(userAutentification.isEmailVerify(user.email)){
      userAutentification.signUser(user);
    }else{
      setIsEmail(true);
    }
  };
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
        <RedirectComponents
          redirectHref={"/account/log"}
          name={"Do you have a account?"}
        />
        <Submit
          registerType={[]}
          reg={null}
          setUser={setUser}
          user={user}
          handleUser={handleUser}
          isEmail={isEmail}
        />
      </TextBox>
    </AccountCard>
  );
};
