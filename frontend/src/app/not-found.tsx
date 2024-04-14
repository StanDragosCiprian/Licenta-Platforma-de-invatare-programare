import Image from "next/image";
import Link from "next/link";
import { urlBackend } from "./UserServer/ServerRequest";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-200">
        
      <div className="text-center">
        <Image
          src={`${urlBackend}error`}
          width={300}
          height={300}
          alt={"error"}
          className="mx-auto"
        />
        <p className="text-xl font-medium m-6">
          Sorry, the page you&apos;re looking for can&rsquo;t be found.&nbsp;
        </p>
        <Link href="/">Go Home</Link>
      </div>
    </div>
  );
};

export default NotFound;