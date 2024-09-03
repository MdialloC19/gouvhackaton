import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SomeService {
    private readonly mongoUri: string;
    private readonly urlAPISMS: string;
    private readonly apiKey: string;
    private readonly sender: string;

    constructor(private configService: ConfigService) {
        this.mongoUri = this.configService.get<string>('mongodb+srv://mdiallo:mdiallo@cluster0.y2hyn2p.mongodb.net/gouvhackaton?retryWrites=true&w=majority&appName=Cluster0');
        this.urlAPISMS = this.configService.get<string>('https://gateway.intechsms.sn/api/send-sms');
        this.apiKey = this.configService.get<string>('667DB72C59E67667DB72C59E68');
        this.sender = this.configService.get<string>('Sama Kayiit');
    }

}
