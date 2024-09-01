import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Citoyen } from 'src/citoyen/citoyen.schema';
import { User } from 'src/user/user.schema';

@Schema()
export class DocumentEntity extends Document {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    uploadedBy: Types.ObjectId;

    @Prop()
    name: string;

    @Prop()
    path: string;

    @Prop()
    date: Date;

    @Prop({ required: true })
    originalname: string;

    @Prop({ required: true })
    mimetype: string;

    @Prop({ required: true })
    size: number;

    @Prop({ required: true, type: Buffer })
    buffer: Buffer;
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);
