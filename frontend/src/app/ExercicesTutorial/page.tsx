import PdfViewer from "../CoursView/[professor]/[courses]/[idCourses]/docsView/DocsView";
import { urlBackend } from "../UserServer/ServerRequest";
import { notFound } from "next/navigation";
import { HandleProfessorWorkout } from "../Entity/HandleProfessorWorkout";

const ExercicesTutorial = async () => {
  if (!(await HandleProfessorWorkout.getProfessorId())) {
    notFound();
  }
  return <PdfViewer url={`${urlBackend}exercices/tutorial`} />;
};

export default ExercicesTutorial;
