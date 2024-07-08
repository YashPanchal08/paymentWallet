import { Transform } from "class-transformer";
import { IsString, Length, Validate } from "class-validator";

function isTenDigitNumber(value: any) {
    const phoneRegex = /^[0-9]{10}$/;
    return typeof value === 'string' && phoneRegex.test(value);
}

export class resendOtp {
    @Transform(({ value }) => String(value))
    @IsString({ message: 'Phone number must be a string' })
    @Length(10, 10, { message: 'Phone number must be a valid 10-digit number' })
    @Validate(isTenDigitNumber, { message: 'Phone number must be a valid 10-digit number' })
    phoneNumber: number;
}