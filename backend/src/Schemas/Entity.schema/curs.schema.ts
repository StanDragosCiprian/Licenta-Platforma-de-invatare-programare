import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IVideo } from '../Entity/IVideo';
import { IPdf } from '../Entity/IPdf';
import { ICompilators } from '../Entity/ICompilators';
@Schema()
export class Curs {
  _id: mongoose.Types.ObjectId;
  @Prop({ type: mongoose.Types.ObjectId })
  studentId: mongoose.Types.ObjectId[];
  @Prop()
  name: string;
  @Prop()
  vizibility: boolean;
  @Prop()
  description: string;
  @Prop()
  imagePath: string;
  @Prop({ type: mongoose.Types.ObjectId })
  colaborationId: mongoose.Types.ObjectId[];
  @Prop()
  curs: [IVideo | IPdf | ICompilators];
}
export const CursSchema = SchemaFactory.createForClass(Curs);
