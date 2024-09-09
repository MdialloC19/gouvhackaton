import { Document, Schema } from 'mongoose';

export interface Comptes extends Document {
    _id: Schema.Types.ObjectId;
    otp?: string;
    idCardNumber: number;
    password: string;
    isConfirmed?: boolean;
    userId: string;
    isDeleted: boolean;
    createdAt: Date;
}
