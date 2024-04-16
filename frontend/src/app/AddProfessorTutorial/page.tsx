import { cookies } from "next/headers";
import PdfViewer from "../CoursView/[professor]/[courses]/[idCourses]/docsView/DocsView";
import { UserRecever } from "../Entity/UserRecever";
import { urlBackend } from "../UserServer/ServerRequest";
import { notFound } from "next/navigation";
const AddProfessorTutorial = async () => {
    const userManager = new UserRecever();
    const idIs =
      cookies().get("id") && (await userManager.isRole("admin/isAdmin"));
    if (!idIs) {
      notFound();
    }
    return <PdfViewer url={`${urlBackend}add/professor/tutorial`} />;
  };
  
  export default AddProfessorTutorial;