import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
    imports: [
        NestConfigModule.forRoot({
            load: [
                () => ({
                    MONGO_URI: 'mongodb+srv://mdiallo:mdiallo@cluster0.y2hyn2p.mongodb.net/gouvhackaton?retryWrites=true&w=majority&appName=Cluster0',
                    urlAPISMS: 'https://gateway.intechsms.sn/api/send-sms',
                    INTECHSMS_API_KEY: '667DB72C59E67667DB72C59E68',
                    SENDER: 'Sama Kayiit',
                }),
            ],
            validationSchema: Joi.object({
                MONGO_URI: Joi.string().uri().required(),
                urlAPISMS: Joi.string().uri().required(),
                INTECHSMS_API_KEY: Joi.string().required(),
                SENDER: Joi.string().required(),
            }),
        }),
    ],
})
export class ConfigModule {}
