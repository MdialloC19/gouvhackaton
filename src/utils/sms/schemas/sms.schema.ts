import * as mongoose from 'mongoose';

export const SmsSchema = new mongoose.Schema({
    intitule: { type: String, required: true },
    contenu: { type: String, required: true },
    idReceiver: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
});
