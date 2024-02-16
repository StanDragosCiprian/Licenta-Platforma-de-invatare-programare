import { Document } from 'mongoose';
export interface IDocumentFormat extends Document {
  format: string;
  documentFormatPath: string;
  documentFormatName: string;
}
