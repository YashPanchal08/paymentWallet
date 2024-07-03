import { IsNumber, IsString } from "class-validator";

export class OtpVerifyDto{
  @IsNumber()
  mobileNumber: number

  @IsNumber()
  otp: number
}