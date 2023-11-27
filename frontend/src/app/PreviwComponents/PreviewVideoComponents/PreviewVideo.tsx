import { VideoCard } from "../../professorworkspace/[name]/video/VideoCard";

export const PreviewVideo = () => {
  return (
    <>
      <VideoCard>
        <h2 className="text-4xl font-extrabold dark:text-white">
          Payments tool for companies
        </h2>
        <p className="mb-4 text-lg font-normal text-gray-500 dark:text-gray-400">
          Deliver great service experiences fast - without the complexity of
          traditional ITSM solutions. Accelerate critical development work,
          eliminate toil, and deploy changes with ease.
        </p>
      </VideoCard>
    </>
  );
};
