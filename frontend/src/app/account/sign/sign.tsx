"use client";
import { useEffect, useState } from "react";
import { AccountCard } from "../CardInputComponents/AccountCard";
import { Submit } from "../CardInputComponents/Submit";
import { TextBox } from "../CardInputComponents/TextBox";
import { RedirectComponents } from "../CardInputComponents/RedirectComponents";
import { UserAuthenticationManager } from "../Entity/UserAuthenticationManager";

export const SignComponents = () => {
  const userAutentification = new UserAuthenticationManager();
  const handleUser = (user: any) => {
  if (userAutentification.isEmailVerify(user.email)) {
      userAutentification.signUser(user);
    }
}
    

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: "z",
  });

  return (
      <AccountCard name="Sign In">
        <TextBox
          registerType={["username", "email", "password"]}
          reg={null}
          setUser={setUser}
          user={user}
        >
          <RedirectComponents
            redirectHref={"/account/log"}
            name={"Do you have a account?"}
          />
          <Submit
            registerType={[]}
            reg={null}
            setUser={setUser}
            user={user}
            handleUser={()=>handleUser(user)}
          />
        </TextBox>
      </AccountCard>
  );

  };