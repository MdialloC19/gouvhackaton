import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true }) 
export class Rendezvous extends Document {
    @Prop({ type: String, required: true })
    citoyen: string; 

    @Prop({ type: String, required: true })
    institution: string; 

    @Prop({ type: Date, required: true })
    dateAndHour: Date; 

    @Prop({ type: Number, required: true })
    duration: number; 

    @Prop({ type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' })
    state: string; 

    @Prop({ type: String, enum: ['low', 'medium', 'high'], default: 'medium' })
    priority: string; 

    @Prop({ type: String, enum: ['initial', 'follow-up'], default: 'initial' })
    type: string; 

    @Prop({ type: String, default: '' })
    comment: string; 
}

export const RendezvousSchema = SchemaFactory.createForClass(Rendezvous);
