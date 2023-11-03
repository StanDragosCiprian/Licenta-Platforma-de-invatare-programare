"use client";
import { IRegister } from "./IRegister";
import { InputUser } from "./InputUser";

interface Register extends IRegister {
  children: JSX.Element[] | JSX.Element;
}

export const TextBox: React.FC<Register> = ({
  registerType,
  children,
  setUser,
  user,
}) => {
  return (
    <>
      {registerType.map((reg, index) => (
        <div key={index}>
          <InputUser
            reg={reg}
            registerType={[]}
            setUser={setUser}
            user={undefined}
            
          />
        </div>
      ))}
      {children}
    </>
  );
};
