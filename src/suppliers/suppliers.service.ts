import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SuppliersService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(dto: CreateSupplierDto) {
		try {
			return await this.prismaService.supplier.create({ data: dto });
		} catch (error) {
			throw new BadRequestException('Supplier already exist');
		}
	}

	async findAll() {
		return this.prismaService.supplier.findMany();
	}

	async findOneOrCreate(dto: CreateSupplierDto) {
		const supplier = await this.prismaService.supplier.findFirst({
			where: { name: dto.name, inn: dto.inn, timeout: dto.timeout },
		});
		if (!supplier) {
			return await this.create(dto);
		}
		return supplier;
	}
}
