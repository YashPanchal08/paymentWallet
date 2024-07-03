import { IsUUID } from "class-validator";

export class GetUserByIdDto{
  @IsUUID()
  userId: string
}