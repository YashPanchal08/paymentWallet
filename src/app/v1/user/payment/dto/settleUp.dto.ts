import { IsOptional, IsUUID } from "class-validator";

export class settleUpDto {

    @IsUUID('4', { message: "Enter valid id" })
    @IsOptional()
    userId: any

    @IsUUID('4', { message: "Enter valid id" })
    @IsOptional()
    splitId: any


}
