import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { CarType } from "../../../common/models/enums/car-type.enum"

export class UpdateUserWishlistDTO {

    action: 'add' | 'remove'

    @IsNotEmpty()
    @IsEnum(CarType)
    carType: CarType

    @IsString()
    @IsNotEmpty()
    carId: string
}