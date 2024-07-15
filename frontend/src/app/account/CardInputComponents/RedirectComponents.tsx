import Link from "next/link";
import { FC } from "react";
interface IRedirect {
  redirectHref: string;
  name: string;
}
export const RedirectComponents: FC<IRedirect> = ({ redirectHref, name }) => {
  return (
    <Link
      href={redirectHref}
      className="mt-4 inline-block font-medium text-blue-600 dark:text-blue-500 hover:underline hover:text-red-600"
    >
      {name}
    </Link>
  );
};
