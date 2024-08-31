import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';

@Schema()
export class Citoyen extends User {
    @Prop()
    fathersName: string;
    @Prop()
    fathersSurname: string;

    @Prop()
    mothersName: string;
    @Prop()
    mothersSurname: string;
    @Prop()
    maritalStatus: string;
    @Prop()
    address: string;
}

export const CitoyenSchema = SchemaFactory.createForClass(Citoyen);
