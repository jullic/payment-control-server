import { Controller, Get, Post, Body } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Controller('suppliers')
export class SuppliersController {
	constructor(private readonly suppliersService: SuppliersService) {}

	@Post()
	create(@Body() dto: CreateSupplierDto) {
		return this.suppliersService.create(dto);
	}

	@Get()
	findAll() {
		console.log(1);
		return this.suppliersService.findAll();
	}

	@Post('find')
	findOneOrCreate(@Body() dto: CreateSupplierDto) {
		return this.suppliersService.findOneOrCreate(dto);
	}
}
