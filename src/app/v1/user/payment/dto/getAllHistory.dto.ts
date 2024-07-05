import { IsDefined, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class getAllHistoryDto {

    @IsUUID('4', { message: "Enter valid id" })
    @IsOptional()
    userId: any

    @IsDefined()
    @IsString()
    page: any

    @IsDefined()
    @IsString()
    limit: any

    @IsOptional()
    @IsString()
    search: any


}