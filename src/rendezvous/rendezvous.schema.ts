import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Rendezvous extends Document {
  @Prop({ required: true })
  citoyen: string;

  @Prop({ required: true })
  institution: string;

  @Prop({ required: true })
  dateAndHour: Date;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true, enum: ['pending', 'confirmed', 'cancelled'] })
  state: string;

  @Prop({ required: true, enum: ['low', 'medium', 'high'] })
  priority: string;

  @Prop({ required: true, enum: ['initial', 'follow-up'] })
  type: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const RendezvousSchema = SchemaFactory.createForClass(Rendezvous);
