import { ExercicesComponens } from "./ExercicesComponents";

export default function Exercices({ params }: any) {
  return (
    <div className="flex justify-center items-center h-full w-screen overflow-auto">
      <ExercicesComponens
        setDialog={undefined}
        courseName={params.name}
        isUpdated={false}
        exercicesName={""}
      />
    </div>
  );
}
