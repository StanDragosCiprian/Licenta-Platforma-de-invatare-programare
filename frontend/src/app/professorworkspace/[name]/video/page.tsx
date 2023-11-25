
import { notFound} from "next/navigation";
import { HandleProfessorWorkout } from "../../HandleProfessorWorkout";
import { UploadVideo } from "./UploadVideo";

export default async function VideoPage() {

  if (!(await HandleProfessorWorkout.getId())) {
    notFound();
  }
  return (
    <>
  
        <UploadVideo name={HandleProfessorWorkout.getDynamicValue()}/>

    </>
  );
}
