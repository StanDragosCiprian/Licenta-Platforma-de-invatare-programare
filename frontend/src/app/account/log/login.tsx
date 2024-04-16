"use client";
import { useState, useEffect } from "react";
import { AccountCard } from "../CardInputComponents/AccountCard";
import { Submit } from "../CardInputComponents/Submit";
import { TextBox } from "../CardInputComponents/TextBox";
import { RedirectComponents } from "../CardInputComponents/RedirectComponents";
import { UserAuthenticationManager } from "../../Entity/UserAuthenticationManager";
import { HiInformationCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
export const LogIn = () => {
  const [isEmailExist, setIsEmailExist] = useState(false);
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: "http://localhost:3000/default/img",
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
      userAuthentication.logUser(user,setIsEmailExist);
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
            name={"You don't have an account?"}
          />
                 {isEmailExist ? (
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">Your email or password are incorect!</span> 
          </Alert>
        ) : <></>}
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
