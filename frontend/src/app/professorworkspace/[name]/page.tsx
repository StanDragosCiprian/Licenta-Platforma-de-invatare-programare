import { UserRecever } from "@/app/account/Entity/UserRecever";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { EditCard } from "../EditCards";
import { urlBackend } from "@/app/UserServer/ServerRequest";
export default async function NewCourse({ params }: any) {
  const userManager = new UserRecever();
  const idIs =
    cookies().get("id") && (await userManager.isRole("admin/isProfessor"));
  if (!idIs) {
    notFound();
  }
  return (
    <div className="w-full px-10 grid grid-flow-row-dense grid-cols-1 grid-rows-3">
      <EditCard imageSrc={`${urlBackend}editcourses/img`} 
      title={`Add video to ${params.name} cours`}
      content={"This is a dedicated space where you can create video content for your courses. Our platform supports a wide range of video formats, allowing you to upload and manage your course videos with ease"}
      />
       <EditCard imageSrc={`${urlBackend}editcourses/img`} 
      title={`Add pdf to ${params.name} cours`}
      content={"This is a dedicated space where you can create video content for your courses. Our platform supports a wide range of video formats, allowing you to upload and manage your course videos with ease"}
      />
       <EditCard imageSrc={`${urlBackend}editcourses/img`} 
      title={`Add code execices to ${params.name} cours`}
      content={"This is a dedicated space where you can create video content for your courses. Our platform supports a wide range of video formats, allowing you to upload and manage your course videos with ease"}
      />
    </div>
  );
}
