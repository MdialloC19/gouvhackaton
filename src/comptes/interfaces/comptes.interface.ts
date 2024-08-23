import { Document } from 'mongoose';

export interface Comptes extends Document {
    idCardNumber: number;
    password: string;
    isConfirmed: boolean;
    userId: string;
    isDeleted: boolean;
    createdAt: Date;
}
