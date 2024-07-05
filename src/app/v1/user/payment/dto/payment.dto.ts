import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min } from "class-validator"

export class paymentDto {

    @IsUUID('4', { message: "Enter valid id" })
    @IsOptional()
    userId: any

    @IsUUID('4', { message: "Enter valid id" })
    @IsDefined()
    receiverId: any

    @IsNumber()
    @IsDefined({ message: "amount is required" })
    @Min(0, { message: "amount must be greater than 0" })
    @IsPositive()
    amount: number

    @IsString()
    @IsOptional()
    splitIds: any

}
