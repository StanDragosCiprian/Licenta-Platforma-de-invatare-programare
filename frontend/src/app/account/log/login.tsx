"use client";
import { useState, useEffect } from "react";
import { AccountCard } from "../CardInputComponents/AccountCard";
import { Submit } from "../CardInputComponents/Submit";
import { TextBox } from "../CardInputComponents/TextBox";
import { RedirectComponents } from "../CardInputComponents/RedirectComponents";
import { UserAuthenticationManager } from "../../Entity/UserAuthenticationManager";

export const LogIn = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: "z",
    role: "",
  });
  let [isEmail, setIsEmail]: any = useState(false);
  const userAuthentication = new UserAuthenticationManager();
  useEffect(() => {
    const handleEmail = () => {
      if(user.email===''){
        setIsEmail(true);
      }else{
        setIsEmail(false);
      }
    };
    handleEmail();
  }, [user,isEmail]);
  const handleUser = (user: any) => {
    if (userAuthentication.isEmailVerify(user.email)) {
      userAuthentication.logUser(user);
    } else {
      setIsEmail(true);
    }
  };
  return (
    <>
      <AccountCard name="Log In">
        <TextBox
          registerType={["email", "password"]}
          reg={null}
          setUser={setUser}
          user={user}
        >
          <RedirectComponents
            redirectHref={"/account/sign"}
            name={"You have an account?"}
          />
          <Submit
            registerType={[]}
            reg={null}
            setUser={setUser}
            user={user}
            handleUser={()=>{isEmail===false?handleUser(user):null}}
          />
        </TextBox>
      </AccountCard>
    </>
  );
};
