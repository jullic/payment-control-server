import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompaniesService {
	constructor(private readonly prismaService: PrismaService) {}

	async findAll() {
		return await this.prismaService.companies.findMany();
	}
}
