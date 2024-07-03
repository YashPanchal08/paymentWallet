import { IsOptional, IsUUID } from "class-validator";

export class GetUserByIdDto{
  @IsUUID()
  @IsOptional()
  userId: string
}