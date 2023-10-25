import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { url } from "../UserServer/ServerRequest";
async function getUser() {
  const id: any = cookies().get("id")?.value;
  let res: any = null;
  if (id !== undefined) {
    res = await fetch(`${url}student/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `id=${id}`,
      },
    });
    const text = await res.text();
    if (text !== "No_Student") {
      return JSON.parse(text);
    } else {
      if (res !== undefined) {
        res = await fetch(`${url}professor/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `id=${id}`,
          },
        });
        return res.json();
      }
    }
  }

  res = JSON.parse(JSON.stringify({ username: "Account" }));
  return res;
}

export const Account = async () => {
  const repo: any = await getUser();

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
          <span className=" hidden group-hover:block hover:opacity-100 self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            <p>{repo.username}</p>
          </span>
        </div>{" "}
      </Link>
    </>
  );
};
