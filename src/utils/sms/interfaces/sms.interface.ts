import { Document } from 'mongoose';

export interface Sms extends Document {
    intitule: string;
    contenu: string;
    idReceiver: string[];
    createdAt: Date;
}
