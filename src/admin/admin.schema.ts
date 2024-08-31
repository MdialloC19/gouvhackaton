import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './../user/user.schema';

@Schema()
export class Admin extends User {
    @Prop({ required: true })
    email: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
