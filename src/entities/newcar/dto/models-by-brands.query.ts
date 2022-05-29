import { Transform } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class ModelsByBrandsQuery {


    @Transform(({ value }) => {
        if(!Array.isArray(value)) {
            return [value]
        }
        else {
            return value
        }
    })
    @IsNotEmpty()
    brand: string[]

}