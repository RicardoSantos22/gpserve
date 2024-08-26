import { IsNotEmpty, IsString } from "class-validator";

export class SendEmail {
    @IsString()
    @IsNotEmpty()
    readonly to: string;
    
    @IsString()
    @IsNotEmpty()
    readonly message: string;

  }