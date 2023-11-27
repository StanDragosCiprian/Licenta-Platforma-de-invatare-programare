import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { UserRecever } from "../Entity/UserRecever";

export const Account = async () => {
  const userManager: any =new UserRecever();
  const repo:any=await userManager.getUser("Account");
  const autentificstion = ["/account/sign"];
  return (
    <>
      <Link href={cookies().get("id") != undefined ? "/" : autentificstion[0]}>
        <div className="bottom-img flex items-center  mb-5">
          <Image
            src="http://localhost:3000/default/img"
            className="w-6 h-6 mr-4 sm:h-7 rounded-full border border-blue-900"
            alt="Flowbite Logo"
            width={24}
            height={24}
          />
          <span className="side-bar-text">
            <p>{repo.username}</p>
          </span>
        </div>{" "}
      </Link>
    </>
  );
};
