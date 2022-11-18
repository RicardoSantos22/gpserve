import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { CarSaleRequestController } from "./controller/carsalerequest.controller";
import { CarSaleRequest } from "./model/carsalerequest.model";
import { CarSaleRequestRepository } from "./repository/carsalerequest.repository";
import { CarSaleRequestService } from "./service/carsalerequest.service";

@Module({
    imports: [TypegooseModule.forFeature([CarSaleRequest])],
    providers: [CarSaleRequestService, CarSaleRequestRepository],
    controllers: [CarSaleRequestController]
})
export class CarSaleRequestModule {}