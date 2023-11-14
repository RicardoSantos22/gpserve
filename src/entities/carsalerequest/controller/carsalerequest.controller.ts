import { Body, Controller, Get, Post, Query, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { JwtAuthGuard } from "../../../auth/guards/jwt-auth.guard";
import { FindAllQuery } from "../../../common/models/dto/query";
import { CreateCarSaleRequest } from "../dto/create-car-sale-request.dto";
import { CarSaleRequestService } from "../service/carsalerequest.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('carsalerequest')
@Controller('carsalerequest')

export class CarSaleRequestController {

    constructor(private readonly service: CarSaleRequestService) {}

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Query() query: FindAllQuery) {
        return this.service.findAll(query)
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true, forbidUnknownValues: true }))
    async create(@Body() dto: CreateCarSaleRequest) {
        return this.service.create(dto)
    }
    
}