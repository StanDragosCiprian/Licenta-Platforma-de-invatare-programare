import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Schema()
export class Curs {
  _id: mongoose.Types.ObjectId;

  @Prop()
  curs: [];
}
export const CursSchema = SchemaFactory.createForClass(Curs);
