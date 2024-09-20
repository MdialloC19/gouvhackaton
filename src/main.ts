import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser'; 
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Configuration de Swagger
    const config = new DocumentBuilder()
        .setTitle('Portail Numérique des Services Publics')
        .setDescription(
            'API pour la gestion des services publics en ligne, permettant la soumission de demandes, la prise de rendez-vous, et la gestion des utilisateurs',
        )
        .setVersion('1.0')
        .addTag('API')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // Configuration CORS
    const corsOptions: CorsOptions = {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        preflightContinue: false,
        allowedHeaders: [
            'Content-type',
            'Access-Control-Request-Headers',
            'range',
            'Content-Range',
            'Authorization',
        ],
        exposedHeaders: ['Content-Range', 'Authorization'],
    };

    app.enableCors(corsOptions);

    
    app.use(cookieParser(process.env.COOKIE_SECRET)); // Utilisation de cookie-parser pour les cookies signés

    await app.listen(3000);
}

bootstrap();
