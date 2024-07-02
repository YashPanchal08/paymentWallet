import { IsNumber, IsString } from "class-validator";

export class OtpVerifyDto{
  @IsString()
  mobileNumber: string

  @IsNumber()
  otp: number
}