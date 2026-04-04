import { NestFactory } from '@nestjs/core';
import { SummerizeModule } from './summerize.module';

async function bootstrap() {
  const app = await NestFactory.create(SummerizeModule);
  await app.listen(process.env.PORT ?? 5000);
  console.log('Application is running on: http://localhost:5000');
}
bootstrap();