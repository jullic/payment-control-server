import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { cors: true });
	await app.listen(3300);
	const prismaService = app.get(PrismaService);
	await prismaService.enableShutdownHooks(app);
}
bootstrap();
