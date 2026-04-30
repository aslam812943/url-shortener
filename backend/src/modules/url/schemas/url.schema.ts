import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Url extends Document {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ required: true, unique: true, index: true })
  shortCode: string;

  @Prop({ type: String, ref: 'User', required: false })
  userId?: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
