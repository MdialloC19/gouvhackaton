import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Form } from '../form/form.schema';
import { Institution } from '../institution/institution.schema';

@Schema()
export class Service extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  documentName: string;

  @Prop()
  fees: number;

  @Prop({ required: true })
  processingTime: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  link: string;

  @Prop({ type: Types.ObjectId, ref: 'Form' })
  form: Form;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Institution' }] })
  institutions: Institution[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
