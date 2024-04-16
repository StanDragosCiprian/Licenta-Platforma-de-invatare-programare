import Link from "next/link";
import IconCloudUpdate from "../IconsComponents/IconCloudUpdate";

const MyCourses = () => {
  return (
    <li className="flex flex-row mb-4">
      <Link href="/MySubscription" className="flex items-center">
        <svg
          className="w-6 h-6 text-[#fffbeb] mr-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 22 22"
        >
          <path
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 12v1h4v-1m4 7H6a1 1 0 0 1-1-1V9h14v9a1 1 0 0 1-1 1ZM4 5h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
          />
        </svg>

        <span className="side-bar-text">My Subscription</span>
      </Link>
    </li>
  );
};

export default MyCourses;
