import { IsNotEmpty, IsNumberString, IsPositive, IsString } from "class-validator";
import { CarSaleRequest } from "../model/carsalerequest.model";


export class CreateCarSaleRequest implements CarSaleRequest {

    @IsString()
    @IsNotEmpty()
    make: string

    @IsString()
    @IsNotEmpty()
    model: string

    @IsString()
    @IsNotEmpty()
    version: string

    @IsPositive()
    @IsNotEmpty()
    year: number

    @IsPositive()
    @IsNotEmpty()
    value: number

    @IsString()
    @IsNotEmpty()
    kms: string

    @IsString()
    @IsNotEmpty()
    carCondition: string

    @IsString()
    @IsNotEmpty()
    transmission: string;

    @IsString()
    @IsNotEmpty()
    state: string

    @IsString()
    @IsNotEmpty()
    sellingPurpose: string

    @IsString()
    @IsNotEmpty()
    colour: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    email: string

    @IsNumberString()
    @IsNotEmpty()
    phoneNumber: string

}