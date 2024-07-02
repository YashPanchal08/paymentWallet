import { IsUUID } from "class-validator";

export class GetUserById{
  @IsUUID()
  userId: string
}