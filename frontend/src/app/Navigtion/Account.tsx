import Link from "next/link";
import Image from "next/image";
import { cookies } from 'next/headers';
import { url } from "../UserServer/ServerRequest";

async function getUser() {
  const id:any=cookies().get('id')?.value;
  if(id!==undefined){
    const res = await fetch(`${url}student/get/${id}`,{method:"GET"});
    if(res===undefined){
      const res = await fetch(`${url}professor/get/${id}`,{method:"GET"});
    }else
    return res.json ()
  }
const user=JSON.parse(JSON.stringify({username:"Account"}));
  return user;
  }
export  const Account = async () => {
  const repo:any=await getUser();
    console.log(repo);
    const autentificstion=['/account/sign'];
    
  return (
    <>
      <Link href={cookies().get('id')!=undefined ? '/':autentificstion[0]}>
        <div className="bottom-img flex items-center  mb-5">
          <Image
            src="http://localhost:3000/default/img"
            className="w-6 h-6 mr-4 sm:h-7 rounded-full border border-blue-900"
            alt="Flowbite Logo"
            width={24}
            height={24}
          />
          <span className=" hidden group-hover:block hover:opacity-100 self-center text-xl font-semibold whitespace-nowrap dark:text-white">
          <p>{repo.username}</p>
          </span>
        </div>{" "}
      </Link>
    </>
  );
};
