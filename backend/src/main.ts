import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Car Parking System API')
        .setDescription(
            'This API allows users to manage multiple parking lots efficiently. ' +
                'It provides functionalities to create, expand, shrink, and monitor parking lots, ' +
                'as well as park and retrieve vehicles based on registration number and color.'
        )
        .setVersion('1.0')
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
