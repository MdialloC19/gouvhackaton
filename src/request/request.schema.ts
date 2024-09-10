import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Citoyen } from '../citoyen/citoyen.schema';
import { Service } from '../service/service.schema';
import { Institution } from 'src/institution/institution.schema';
import { Fonctionnaire } from 'src/fonctionnaire/fonctionnaire.schema';


enum RequestState {
    EnCours = 'en-cours',
    Confirme = 'confirmé',
    Termine = 'terminé',
    Rejete = 'rejeté',
}

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

    @Prop({ required: true, enum: RequestState, default: RequestState.EnCours })
    state: string;

    @Prop()
    commentByAgent: string;

    @Prop()
    commentByCitoyen: string;

    @Prop({ type: [{ type: Types.ObjectId }] })
    documentsByAgent: Types.Array<Types.ObjectId>;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Fonctionnaire' }] })
    processedBy: Types.ObjectId[];

    @Prop({ type: Types.ObjectId, ref: 'Institution', required: true })
    institution: Institution;

    @Prop({ type: Map, of: String })
    textResponses: Map<string, string>;

    @Prop({ type: Map, of: Types.ObjectId })
    documentResponses: Map<string, Types.ObjectId>;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
