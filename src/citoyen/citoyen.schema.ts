import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '../user/user.schema';
export enum MaritalStatus {
    SINGLE = 'Celibataire',
    MARRIED = 'Marié(e)',
    DIVORCED = 'Divorcé(e)',
    WIDOWED = 'Veuf(ve)',
}
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

    @Prop({
        type: String,
        enum: MaritalStatus,
        default: MaritalStatus.SINGLE,
    })
    maritalStatus: MaritalStatus;
    @Prop()
    address: string;

    @Prop()
    birthCountry: string;

    @Prop()
    birthDepartment: string;
}

export const CitoyenSchema = SchemaFactory.createForClass(Citoyen);
