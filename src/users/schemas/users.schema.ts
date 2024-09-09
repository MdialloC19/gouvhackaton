import * as mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: Number, required: true, unique: true },
    idCardNumber: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const skipDeleted = function (next) {
    this.where({ isDeleted: false });
    next();
};

UsersSchema.pre('find', skipDeleted);
UsersSchema.pre('findOne', skipDeleted);
UsersSchema.pre('updateOne', skipDeleted);
UsersSchema.pre('updateMany', skipDeleted);
UsersSchema.pre('findOneAndUpdate', skipDeleted);
UsersSchema.pre('deleteOne', skipDeleted);
UsersSchema.pre('deleteMany', skipDeleted);

export { UsersSchema };
