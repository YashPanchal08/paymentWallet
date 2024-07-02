import { IsOptional, IsUUID } from "class-validator";

export class GetSplitHistoryDto{

  @IsUUID()
  @IsOptional()
  userId: string
}