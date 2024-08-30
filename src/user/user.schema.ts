import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  CNI: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  name: string;

  @Prop()
  surname: string;

  @Prop()
  birthday: Date;

  @Prop()
  job: string;

  @Prop()
  sex: string; // EnumSex

  @Prop()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
