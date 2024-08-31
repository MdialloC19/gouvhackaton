import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class DocumentEntity extends Document {
    @Prop() // Ce champ est optionnel
    id: string; // Peut être utilisé comme un identifiant alternatif

    @Prop() // Nom du document
    name: string;

    @Prop() // Chemin du fichier si stocké sur le système de fichiers
    path: string;

    @Prop() // Date de création ou d'upload du document
    date: Date;

    // Champs pour gérer le contenu du fichier
    @Prop({ required: true })
    originalname: string; // Nom original du fichier

    @Prop({ required: true })
    mimetype: string; // Type MIME du fichier

    @Prop({ required: true })
    size: number; // Taille du fichier en octets

    @Prop({ required: true, type: Buffer })
    buffer: Buffer; // Contenu du fichier en mémoire
}

export const DocumentSchema = SchemaFactory.createForClass(DocumentEntity);
