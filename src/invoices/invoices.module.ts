import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SuppliersService } from 'src/suppliers/suppliers.service';

@Module({
	controllers: [InvoicesController],
	providers: [InvoicesService, PrismaService, SuppliersService],
})
export class InvoicesModule {}
