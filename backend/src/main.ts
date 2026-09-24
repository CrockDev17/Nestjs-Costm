import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Permet au frontend React de communiquer avec l'API NestJS
  await app.listen(3000);
  console.log('🚀 Serveur Backend COSTM démarré sur http://localhost:3000');
}
bootstrap();