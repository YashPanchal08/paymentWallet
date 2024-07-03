import { IsOptional, IsUUID } from "class-validator";

export class DeleteUserDto{
  @IsUUID()
  @IsOptional()
  user_id:string
}