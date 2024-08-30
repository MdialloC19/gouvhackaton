import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Service } from '../service/service.schema';

@Schema()
export class Form extends Document {
  @Prop({ required: true })
  description: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Field' }] })
  fields: Types.Array<Types.ObjectId>;

  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  service: Service;
}

export const FormSchema = SchemaFactory.createForClass(Form);
