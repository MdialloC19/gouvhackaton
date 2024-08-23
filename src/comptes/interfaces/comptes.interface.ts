import { Document } from 'mongoose';

export interface Comptes extends Document {
    otp?: string;
    idCardNumber: number;
    password: string;
    isConfirmed?: boolean;
    userId: string;
    isDeleted: boolean;
    createdAt: Date;
}
