import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
    .setTitle('Portail Numérique des Services Publics')    .setDescription('API pour la gestion des services publics en ligne, permettant la soumission de demandes, la prise de rendez-vous,et la gestion des utilisateurs ')
    .setVersion('1.0')
    .addTag('API')
    .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
bootstrap();
