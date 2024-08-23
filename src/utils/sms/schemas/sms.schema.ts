import * as mongoose from 'mongoose';

export const SmsSchema = new mongoose.Schema({
    intitule: { type: String, required: true },
    contenu: { type: String, required: true },
    idReceiver: [
        {
            type: Number,
            required: true,
        },
    ],
    createdAt: { type: Date, default: Date.now },
});
