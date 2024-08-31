import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Request } from '../request/request.schema';
import { Field } from '../service/field.schema';

@Schema()
export class FormResponse extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Request', required: true })
  request: Request;

  @Prop([{ 
    field: { type: Types.ObjectId, ref: 'Field' }, // Référence au champ du formulaire
    responseValue: { type: String }, // Valeur de la réponse pour les champs texte
    fileUrl: { type: String } // URL pour les réponses de type fichier
  }])
  responses: Array<{ 
    field: Types.ObjectId; // Référence au champ du formulaire
    responseValue?: string; // Réponse pour les champs texte
    fileUrl?: string; // URL pour les champs de type fichier
  }>;
}

export const FormResponseSchema = SchemaFactory.createForClass(FormResponse);
