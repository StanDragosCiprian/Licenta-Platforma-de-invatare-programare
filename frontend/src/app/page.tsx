//page.tsx
import { Sidebar } from "./Navigtion/Sidebar";
import { cookies } from "next/headers";
import { useRouter } from "next/router";
export default function Home() {
  console.log(cookies().get('id'))
  return (
    <>
     
    </>
  );
}
