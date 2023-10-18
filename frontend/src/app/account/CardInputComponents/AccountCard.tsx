"use client"
interface Register {
  name: string;
  children: JSX.Element;
}
export const AccountCard: React.FC<Register> = ({ name, children }) => {
  return (
    <div className="flex justify-center items-center h-screen mx-[36vw]">
      <div className="account-card ">
        <h5 className="text-xl font-medium text-gray-900 ">
          {name} in to our platform
        </h5>
        {children}
      </div>
    </div>
  );
};
