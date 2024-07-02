import { IsOptional, IsString } from "class-validator";

export class PaymentHistoryByIdDto{
  @IsString()
  @IsOptional()
  userId: string

  @IsString()
  receiverId: string
}