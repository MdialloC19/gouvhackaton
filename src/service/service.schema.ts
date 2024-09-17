import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Institution } from '../institution/institution.schema';
import { FormFieldDto } from './dto/create-service.dto';
@Schema()
export class Service extends Document {
    @Prop({ required: true, unique: true })
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

    @Prop({ required: true, unique: true })
    link: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Institution' }] })
    institutions: Institution[];

    @Prop({ type: [{ type: Object }] })
    fields: FormFieldDto[];

    @Prop()
    whoCanMakeRequest: string;

    @Prop()
    structureInCharge: string;

    @Prop()
    competentInstitution: string;

    @Prop()
    serviceHours: string;

    @Prop({ type: [String] })
    stepsToFollow: string[];

    @Prop()
    youtubeLink: string;

    @Prop()
    wolofVoiceLink: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
