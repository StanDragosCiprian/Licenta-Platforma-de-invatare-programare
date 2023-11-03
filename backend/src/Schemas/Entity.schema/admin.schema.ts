import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema()
class Admin {
  _id: mongoose.Types.ObjectId;
  @Prop()
  username: string;
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  profileImage: string;
  @Prop()
  role: string;
}
export const AdminSchema = SchemaFactory.createForClass(Admin);
