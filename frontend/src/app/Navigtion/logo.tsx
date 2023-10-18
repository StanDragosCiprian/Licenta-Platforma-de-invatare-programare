import Link from "next/link";
import Image from "next/image";
export const Logo = () => {
  return (
    <Link href="/" className="flex items-center  mb-5">
      <Image
        src="https://flowbite.com/docs/images/logo.svg"
        className="h-6 mr-4 sm:h-7 "
        alt="Flowbite Logo"
        width={24}
        height={24}
      />
      <span className=" hidden group-hover:block hover:opacity-100 self-center text-xl font-semibold whitespace-nowrap dark:text-white">
        ProgrammingLand
      </span>
    </Link>
  );
};
