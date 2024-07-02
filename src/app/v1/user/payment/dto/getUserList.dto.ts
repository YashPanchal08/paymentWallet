import { IsOptional, IsUUID } from "class-validator";

export class GetUserListDto{
  @IsUUID()
  @IsOptional()
  userId: string
}