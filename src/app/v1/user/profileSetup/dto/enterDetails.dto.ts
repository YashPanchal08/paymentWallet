import { IsEmail, IsOptional, IsString, IsUUID } from "class-validator";

export class UserDetailsDTo{
  
  @IsUUID()
  @IsOptional()
  user_id: string

  @IsString()
  @IsOptional()
  fullName : string

  @IsEmail()
  @IsOptional()
  email: string

}