import { Dispatch, SetStateAction } from "react";

export interface IName {
  name: string;
}

export interface IVideoDescription {
  setVideoDescription: Dispatch<
    SetStateAction<{
      title: string;
      filePath: string;
      description: string;
    }>
  >;
}
