import { Document } from 'mongoose';
export interface IPdf extends Document {
  pdfPath: string;
  pdfName: string;
}
