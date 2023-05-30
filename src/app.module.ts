import { Module } from '@nestjs/common';
import { InvoicesModule } from './invoices/invoices.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { PrismaService } from './prisma/prisma.service';
import { CompaniesModule } from './companies/companies.module';

@Module({
	imports: [InvoicesModule, SuppliersModule, CompaniesModule],
	providers: [PrismaService],
})
export class AppModule {}
