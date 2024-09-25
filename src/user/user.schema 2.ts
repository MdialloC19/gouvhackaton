import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document } from 'mongoose';

export enum EnumSex {
    M = 'M',
    F = 'F',
}

@Schema()
export class User extends Document {
    @Prop()

    CNI: string;

    @Prop()
    phoneNumber: string;

    @IsNotEmpty()
    @Prop({ required: true })
    name: string;

    @IsNotEmpty()
    @Prop({ required: true })
    surname: string;

    @Prop()
    birthday: Date;

    @Prop()
    job: string;

    @Prop({ required: true })
    sex: EnumSex;

    @Prop({ required: true })
    @IsNotEmpty()
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
