import Link from "next/link";
import Image from "next/image";
export const Logo = () => {
  return (
    <Link href="/" className="flex items-center  mb-4">
      <Image
        src="https://flowbite.com/docs/images/logo.svg"
        className="h-6 mr-4 sm:h-7 "
        alt="Flowbite Logo"
        width={24}
        height={24}
      />
      <span className="side-bar-text">
        ProgrammingLand
      </span>
    </Link>
  );
};
