import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DocumentEntity extends Document {
    @Prop()
    id: string;

    @Prop()
    name: string;

    @Prop()
    path: string;

    @Prop()
    date: Date;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);
