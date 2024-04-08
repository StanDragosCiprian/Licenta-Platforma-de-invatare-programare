"use client";
import { useEffect, useState } from "react";
import { AccountCard } from "../CardInputComponents/AccountCard";
import { Submit } from "../CardInputComponents/Submit";
import { TextBox } from "../CardInputComponents/TextBox";
import { RedirectComponents } from "../CardInputComponents/RedirectComponents";
import { UserAuthenticationManager } from "../../Entity/UserAuthenticationManager";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";

export const SignComponents = () => {
  const [isEmailExist, setIsEmailExist] = useState(false);
  const userAutentification = new UserAuthenticationManager();
  const handleUser = (user: any) => {
    if (userAutentification.isEmailVerify(user.email)) {
      userAutentification.signUser(user,setIsEmailExist);
    }
  };

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: "http://localhost:3000/default/img",
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
        {isEmailExist ? (
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">Your email already exists!</span> 
          </Alert>
        ) : <></>}
        <Submit
          registerType={[]}
          reg={null}
          setUser={setUser}
          user={user}
          handleUser={() => handleUser(user)}
        />
      </TextBox>
    </AccountCard>
  );
};
