import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Institution } from '../institution/institution.schema';

@Schema()
export class Fonctionnaire extends User {
  @Prop()
  idNumber: string;

  @Prop()
  email: string;

  @Prop()
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'Institution', required: true })
  institution: Institution; // Référence à l'institution où le fonctionnaire travaille
}

export const FonctionnaireSchema = SchemaFactory.createForClass(Fonctionnaire);
