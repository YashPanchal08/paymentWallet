import { IsMobilePhone, IsNumber, IsString } from "class-validator";

export class OtpVerifyDto{

  @IsNumber()
  mobileNumber: string

  @IsNumber()
  otp: number
}