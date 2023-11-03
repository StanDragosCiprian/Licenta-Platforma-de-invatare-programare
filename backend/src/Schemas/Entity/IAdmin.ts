import { Document, Types } from 'mongoose';
export interface IAdmin extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  profileImage: string;
  role: string;
}
