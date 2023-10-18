import Link from "next/link";
import Image from "next/image";
import { cookies } from 'next/headers';


export const Account = ({ imageUrl }: any) => {
    console.log(imageUrl);
    const autentificstion=['/account/sign']
  return (
    <>
      <Link href={cookies().get('id')!=null ? '/':autentificstion[0]}>
        <div className="bottom-img flex items-center  mb-5">
          <Image
            src="http://localhost:3000/default/img"
            className="w-6 h-6 mr-4 sm:h-7 rounded-full border border-blue-900"
            alt="Flowbite Logo"
            width={24}
            height={24}
          />
          <span className=" hidden group-hover:block hover:opacity-100 self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Account
          </span>
        </div>{" "}
      </Link>
    </>
  );
};
