import { IsEnum, IsNotEmpty } from "class-validator";

export enum ValidUserDocument {
    IdentificacionOficial = 'IdentificacionOficial',
    ComprobanteDomicilio = 'ComprobanteDomicilio',
    EstadoDeCuenta = 'EstadoDeCuenta',
    EstadoDeCuenta2 = 'EstadoDeCuenta2',
    ComprobanteNomina = 'ComprobanteNomina',
    ComprobanteNomina2 = 'ComprobanteNomina2'
}

export class UpdateUserDocuments {

    @IsNotEmpty()
    @IsEnum(ValidUserDocument)
    name: ValidUserDocument

}