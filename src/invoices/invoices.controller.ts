import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	Query,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Controller('invoices')
export class InvoicesController {
	constructor(private readonly invoicesService: InvoicesService) {}

	@Post()
	create(@Body() dto: CreateInvoiceDto) {
		return this.invoicesService.create(dto);
	}

	@Get('paid')
	findPaid(@Query() query: { startDate: string; lastDate: string }) {
		return this.invoicesService.findWithStatus(
			query.startDate,
			query.lastDate,
			'paid',
		);
	}

	@Get('unpaid')
	findUnpaid(@Query() query: { startDate: string; lastDate: string }) {
		return this.invoicesService.findWithStatus(
			query.startDate,
			query.lastDate,
			'unpaid',
		);
	}

	@Get('all')
	findAll(@Query() query: { startDate: string; lastDate: string }) {
		return this.invoicesService.findAll(query.startDate, query.lastDate);
	}

	@Get('range')
	getRange() {
		return this.invoicesService.getRange();
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: CreateInvoiceDto) {
		console.log(1222);
		return this.invoicesService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.invoicesService.remove(id);
	}
}
