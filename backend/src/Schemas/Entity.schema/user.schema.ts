import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema()
export class User {
  _id: mongoose.Types.ObjectId;
  @Prop()
  username: string;
  @Prop({ unique: true, required: true })
  email: string;
  @Prop()
  password: string;
  @Prop()
  profileImage: string;
  @Prop()
  role: string;
}
