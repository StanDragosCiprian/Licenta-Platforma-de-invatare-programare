import { notFound } from "next/navigation";
import { EditCard } from "../EditCards";
import { urlBackend } from "@/app/UserServer/ServerRequest";
import Link from "next/link";
import { HandleProfessorWorkout } from "../../Entity/HandleProfessorWorkout";
export default async function NewCourse({ params }: any) {
  if (!await HandleProfessorWorkout.getId()) {
    notFound();
  }
  const handleName = (): string => {
    const name=params.name.replace("%20", " ");

    return name;
  };
  return (
    <div className="w-full px-10 grid grid-flow-row-dense grid-cols-1 grid-rows-3">
      <Link
        href={`/professorworkspace/${params.name}/video`}
        className="hover:cursor-pointer hover:scale-103 transition-transform duration-200"
      >
        <EditCard
          imageSrc={`${urlBackend}editcourses/videoImg`}
          title={`Add video to ${handleName()} cours`}
          content={
            "Discover a specialized hub for effortlessly uploading and managing your course videos. Our platform seamlessly supports a variety of video formats, providing you with a user-friendly interface for easy organization. Elevate your teaching experience as you dive into a world where sharing and presenting video content is intuitive and efficient"
          }
        />
      </Link>
      <Link
        href="/professorworkspace"
        className="hover:cursor-pointer hover:scale-103 transition-transform duration-200"
      >
        <EditCard
          imageSrc={`${urlBackend}editcourses/pdfImg`}
          title={`Add pdf to ${handleName()} cours`}
          content={
            "Explore your exclusive PDF repository for course materials. This dedicated space empowers you to effortlessly upload and organize your PDF documents. Our platform seamlessly handles a diverse range of PDF formats, ensuring a smooth experience as you manage and share essential course materials. Streamline your teaching process with our intuitive interface, designed to make PDF uploading and management a breeze."
          }
        />
      </Link>
      <Link
        href="/professorworkspace"
        className="hover:cursor-pointer hover:scale-103 transition-transform duration-200"
      >
        <EditCard
          imageSrc={`${urlBackend}editcourses/codeImg`}
          title={`Add code execices to ${handleName()} cours`}
          content={
            "Explore a dedicated space for crafting and sharing programming exercises effortlessly. Our platform supports a variety of programming languages, facilitating seamless uploading and organization of coding challenges. Elevate your teaching experience with our user-friendly interface, simplifying the process of managing programming exercises. Dive into a world where sharing and learning code is intuitive and efficient."
          }
        />
      </Link>
    </div>
  );
}
