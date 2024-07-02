import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID, Min, ValidateNested } from "class-validator";
import { UUID } from "typeorm/driver/mongodb/bson.typings";

export class PayDto{
  @IsString()
  @IsOptional()
  userId:string

  @IsUUID()
  receiverId: string

  // @IsDecimal({ force_decimal: false, decimal_digits: '2' })
  @IsNotEmpty({ message: 'amount is required' })
  @Min(1, { message: 'amount must be greater than or equal to 1' })
  amount: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => PayDto)
  splitId: PayDto[];
}
