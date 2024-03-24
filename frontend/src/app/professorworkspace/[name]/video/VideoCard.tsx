import { FC } from "react";

export const VideoCard: FC<any> = ({ children }) => {
  return (
    <>
      
        <div className="w-full max-w-2xl p-8 bg-white border rounded-lg shadow sm:p-12 md:p-16">
          <h5 className="text-2xl font-medium text-gray-900">Upload video</h5>
          <div className="w-full grid grid-rows-3 grid-flow-col">
            <div className="col-span-2">{children[0]}</div>
            <div className="row-span-2 col-span-2">{children[1]}</div>
            <div className="row-span-3 ml-4">{children[2]}</div>
            <div className="row-start-4 col-start-1 col-end-5 ">
            {children[3]}
            </div>
          </div>
        </div>

    </>
  );
};
