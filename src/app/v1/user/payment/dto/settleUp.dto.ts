import { IsOptional, IsUUID } from "class-validator";

export class SettleUpDto{
  @IsUUID()
  splitId: string

  @IsUUID()
  @IsOptional()
  userId: string
}