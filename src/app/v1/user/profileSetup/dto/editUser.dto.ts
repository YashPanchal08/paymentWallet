import { IsEmail, IsOptional, IsString, IsUUID } from "class-validator";

export class EditUserDto {

  @IsUUID('4', { message: "Enter a Valid id" })
  @IsOptional()
  userId: string

  @IsString()
  fullName: string

  @IsEmail()
  email: string

}