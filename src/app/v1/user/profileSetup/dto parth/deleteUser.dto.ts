import { IsOptional, IsUUID } from "class-validator";

export class DeleteUserDto{
  @IsUUID()
  @IsOptional()
  userId:string
}