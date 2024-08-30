import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Citoyen } from '../citoyen/citoyen.schema';
import { Service } from '../service/service.schema';
import { DocumentEntity } from '../document/document.schema';
import { Fonctionnaire } from '../fonctionnaire/fonctionnaire.schema';

@Schema()
export class Request extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Citoyen', required: true })
  citoyen: Citoyen;

  @Prop({ type: Types.ObjectId, ref: 'Service', required: true })
  service: Service;

  @Prop()
  dateAndHour: Date;

  @Prop()
  dateAndHourTreatment: Date;

  @Prop()
  state: string; // EnumState

  @Prop()
  comment: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'DocumentEntity' }] })
  documents: Types.Array<Types.ObjectId>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Fonctionnaire' }] })
  processedBy: Types.Array<Types.ObjectId>; // Tableau de références aux fonctionnaires
}

export const RequestSchema = SchemaFactory.createForClass(Request);
