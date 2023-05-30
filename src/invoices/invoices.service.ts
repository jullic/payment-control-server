import { BadRequestException, Injectable } from '@nestjs/common';
import { SuppliersService } from './../suppliers/suppliers.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSupplierDto } from 'src/suppliers/dto/create-supplier.dto';

@Injectable()
export class InvoicesService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly supplierService: SuppliersService,
	) {}

	async create(dto: CreateInvoiceDto) {
		const {
			inn,
			firm,
			timeout,
			myCompany,
			startDate,
			lastDate,
			...invoiceData
		} = dto;

		const [sDay, sMonth, sYear] = startDate.split('.');
		const sDate = new Date(+sYear, +sMonth - 1, +sDay);

		const [lDay, lMonth, lYear] = lastDate.split('.');
		const lDate = new Date(+lYear, +lMonth - 1, +lDay);

		const supplierDto: CreateSupplierDto = {
			inn,
			name: firm,
			timeout,
		};

		const supplier = await this.supplierService.findOneOrCreate(
			supplierDto,
		);
		const company = await this.prismaService.companies.findUnique({
			where: { name: myCompany },
		});

		try {
			const invoice = await this.prismaService.invoice.create({
				data: {
					...invoiceData,
					startDate: sDate,
					lastDate: lDate,
					supplierId: supplier.id,
					companiesId: company.id,
				},
			});

			return invoice;
		} catch (error) {
			console.log(error);
			throw new BadRequestException('Incorrect data');
		}
	}

	async findAll(startDate: string, lastDate: string) {
		try {
			const [sDay, sMonth, sYear] = startDate.split('-').reverse();
			const sDate = new Date(+sYear, +sMonth - 1, +sDay);

			const [lDay, lMonth, lYear] = lastDate.split('-').reverse();
			const lDate = new Date(+lYear, +lMonth - 1, +lDay);

			const invoices = await this.prismaService.invoice.findMany({
				where: {
					deleted: false,
					AND: {
						lastDate: { gte: sDate },
						AND: { lastDate: { lte: lDate } },
					},
				},
				include: { myCompany: true, supplier: true },
				orderBy: { lastDate: 'asc' },
			});

			return invoices;
		} catch (error) {
			throw new BadRequestException('Incorrect query');
		}
	}

	async findWithStatus(
		startDate: string,
		lastDate: string,
		status: 'unpaid' | 'paid',
	) {
		try {
			const [sDay, sMonth, sYear] = startDate.split('-').reverse();
			const sDate = new Date(+sYear, +sMonth - 1, +sDay);

			const [lDay, lMonth, lYear] = lastDate.split('-').reverse();
			const lDate = new Date(+lYear, +lMonth - 1, +lDay);

			const invoices = await this.prismaService.invoice.findMany({
				where: {
					status,
					AND: {
						deleted: false,
						AND: {
							lastDate: { gte: sDate },
							AND: { lastDate: { lte: lDate } },
						},
					},
				},
				include: { myCompany: true, supplier: true },
				orderBy: { lastDate: 'asc' },
			});

			return invoices;
		} catch (error) {
			throw new BadRequestException('Incorrect query');
		}
	}

	async getRange() {
		const startDate =
			(
				await this.prismaService.invoice.findFirst({
					where: { deleted: false, AND: { status: 'unpaid' } },
					orderBy: { lastDate: 'asc' },
				})
			)?.lastDate ||
			new Date(new Date().getTime() - 30 * 1000 * 60 * 60 * 24);
		const lastDate =
			(
				await this.prismaService.invoice.findFirst({
					where: { deleted: false, AND: { status: 'unpaid' } },
					orderBy: { lastDate: 'desc' },
				})
			)?.lastDate ||
			new Date(new Date().getTime() + 30 * 1000 * 60 * 60 * 24);
		return { startDate, lastDate };
	}

	async update(id: string, dto: CreateInvoiceDto) {
		console.log('Update');
		const {
			inn,
			firm,
			timeout,
			myCompany,
			startDate,
			lastDate,
			...invoiceData
		} = dto;

		const oldInvoice = await this.prismaService.invoice.findUnique({
			where: { id },
		});

		const isChangedSum =
			dto.sum && oldInvoice?.sum && !(oldInvoice.sum === dto.sum);
		const changedSumDates = [...oldInvoice.changedSumDates, new Date()];

		const [sDay, sMonth, sYear] = startDate.split('.');
		const sDate = new Date(+sYear, +sMonth - 1, +sDay);

		const [lDay, lMonth, lYear] = lastDate.split('.');
		const lDate = new Date(+lYear, +lMonth - 1, +lDay);

		const supplierDto: CreateSupplierDto = {
			inn,
			name: firm,
			timeout,
		};

		const supplier = await this.supplierService.findOneOrCreate(
			supplierDto,
		);
		const company = await this.prismaService.companies.findUnique({
			where: { name: myCompany },
		});

		try {
			if (isChangedSum) {
				return await this.prismaService.invoice.update({
					where: { id },
					data: {
						...invoiceData,
						startDate: sDate,
						lastDate: lDate,
						supplierId: supplier.id,
						companiesId: company.id,
						changedSum: true,
						changedSumDates,
					},
				});
			}
			return await this.prismaService.invoice.update({
				where: { id },
				data: {
					...invoiceData,
					startDate: sDate,
					lastDate: lDate,
					supplierId: supplier.id,
					companiesId: company.id,
				},
			});
		} catch (error) {
			console.log(error);
			throw new BadRequestException('Incorrect data');
		}
	}

	async remove(id: string) {
		return await this.prismaService.invoice.update({
			where: { id },
			data: { deleted: true, deletedDate: new Date() },
		});
	}
}
