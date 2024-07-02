import { IsOptional, IsString, IsUUID } from "class-validator";

export class PaymentHistoryDto{
  @IsOptional()
  @IsString()
  @IsUUID()
  userId: string
}