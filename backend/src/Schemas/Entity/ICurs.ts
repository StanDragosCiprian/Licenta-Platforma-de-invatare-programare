import { Document, Types } from 'mongoose';
export interface ICurs extends Document {
  _id: Types.ObjectId;
  curs: [];
}
