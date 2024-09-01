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

    @Prop({ required: true })
    dateAndHour: Date;

    @Prop()
    duration: number; // Durée du rendez-vous en minutes

    @Prop({ default: 'pending' })
    state: string; // Exemple: 'pending', 'confirmed', 'canceled'

    @Prop()
    priority: string; // Exemple: 'low', 'medium', 'high'

    @Prop()
    type: string; // Type de rendez-vous, par exemple 'initial', 'follow-up'

    @Prop()
    comment: string;

    @Prop()
    createdAt: Date; // Date de création du rendez-vous

    @Prop()
    updatedAt: Date; // Date de la dernière mise à jour du rendez-vous
}

export const RendezvousSchema = SchemaFactory.createForClass(Rendezvous);

// pre-save hook to handle createdAt and updatedAt timestamps
RendezvousSchema.pre('save', function (next) {
    const now = new Date();
    if (!this.createdAt) {
        this.createdAt = now;
    }
    this.updatedAt = now;
    next();
});
