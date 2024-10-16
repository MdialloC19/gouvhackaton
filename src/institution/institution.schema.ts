import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Institution extends Document {
    @Prop({ required: true, unique: true })
    name: string;

    @Prop({ required: true })
    department: string;

    @Prop({ required: true })
    domain: string;

    @Prop({ required: true })
    locality: string;
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);
