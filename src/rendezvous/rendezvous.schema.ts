import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Citoyen } from '../citoyen/citoyen.schema';
import { Institution } from '../institution/institution.schema';

@Schema()
export class Rendezvous extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Citoyen', required: true })
    citoyen: Citoyen;

    @Prop({ type: Types.ObjectId, ref: 'Institution', required: true })
    institution: Institution;

    @Prop()
    dateAndHour: Date;

    @Prop()
    state: string;

    @Prop()
    comment: string;
}

export const RendezvousSchema = SchemaFactory.createForClass(Rendezvous);
