import { Document } from 'mongoose';

export interface User extends Document {
    firstName: string;
    lastName: string;
    email: string;
    number: number;
    idCardNumber: number;
    isDeleted: boolean;
    createdAt: Date;
}
