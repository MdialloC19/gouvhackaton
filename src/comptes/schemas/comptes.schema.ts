import * as mongoose from 'mongoose';
import { optimizeDeps } from 'vite';

const ComptesSchema = new mongoose.Schema({
    idCardNumber: { type: Number, required: true },
    password: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    isDeleted: { type: Boolean, default: false },
    otp: { type: Number, required: false },
    createdAt: { type: Date, default: Date.now },
});

const skipDeleted = function (next) {
    this.where({ isDeleted: false });
    next();
};

ComptesSchema.pre('find', skipDeleted);
ComptesSchema.pre('findOne', skipDeleted);
ComptesSchema.pre('updateOne', skipDeleted);
ComptesSchema.pre('updateMany', skipDeleted);
ComptesSchema.pre('findOneAndUpdate', skipDeleted);
ComptesSchema.pre('deleteOne', skipDeleted);
ComptesSchema.pre('deleteMany', skipDeleted);

export { ComptesSchema };
