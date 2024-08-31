import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum EnumFieldType {
    TEXT = 'text',
    URL = 'url',
    TEL = 'tel',
    NUMBER = 'number',
    RANGE = 'range',
    DATE = 'date',
    CHECKBOX = 'checkbox',
    RADIO = 'radio',
    FILE = 'file',
    TEXTAREA = 'textArea',
    SELECT = 'select',
}

@Schema()
export class Field extends Document {
    @Prop({ required: true })
    label: string;

    @Prop({ required: true, enum: EnumFieldType })
    fieldType: EnumFieldType;

    @Prop({ required: true })
    required: boolean;

    @Prop({ type: [String] })
    options?: string[];

    @Prop()
    min?: number;

    @Prop()
    max?: number;

    @Prop()
    filetype?: string;

    @Prop()
    step?: number;
}

export const FieldSchema = SchemaFactory.createForClass(Field);
