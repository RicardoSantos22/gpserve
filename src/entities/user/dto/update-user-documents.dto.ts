import { IsEnum, IsNotEmpty } from "class-validator";

export enum ValidUserDocument {
    IdentificacionOficial = 'IdentificacionOficial',
    ComprobanteDomicilio = 'ComprobanteDomicilio',
    EstadoDeCuenta = 'EstadoDeCuenta'
}

export class UpdateUserDocuments {

    @IsNotEmpty()
    @IsEnum(ValidUserDocument)
    name: ValidUserDocument

}