import { Type } from "class-transformer";
import { IsMobilePhone, IsNumber, IsOptional, IsString, Matches, Validate } from "class-validator";

function isPhoneNumber(value: number) {

  const phoneRegex = /^[0-9]{10}$/;
  return typeof value === 'number' && phoneRegex.test(value.toString());
}
export class OtpVerifyDto {

  @IsNumber()
  @Validate(isPhoneNumber, {
    message: 'Phone number must be a valid format (e.g., 10-digit number)'
  })
  @Type(() => Number)
  mobileNumber: number;

  @IsNumber()
  otp: number

}