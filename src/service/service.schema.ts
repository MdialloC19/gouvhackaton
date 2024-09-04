import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Institution } from '../institution/institution.schema';
import { Field } from './field.schema';
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

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Institution' }] })
    institutions: Institution[];

    @Prop({ type: [{ type: Object }] })
    fields: Field[];
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
