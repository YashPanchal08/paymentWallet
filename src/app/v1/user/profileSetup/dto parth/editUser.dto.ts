import { IsEmail, IsOptional, IsString, IsUUID } from "class-validator";

export class EditUserDto{

  @IsUUID()
  userId: string
  
  @IsUUID()
  @IsOptional()
  user_id: string

  @IsString()
  fullName : string

  @IsEmail()
  email: string

}