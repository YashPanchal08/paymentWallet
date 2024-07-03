// src/users/dto/create-user.dto.ts

import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { Type } from 'class-transformer';

function isPhoneNumber(value: number) {

    const phoneRegex = /^[0-9]{10}$/; 
    return typeof value === 'number' && phoneRegex.test(value.toString());
}

export class loginDto {

    @IsNumber()
    @Validate(isPhoneNumber, {
        message: 'Phone number must be a valid format (e.g., 10-digit number)'
    })
    @Type(() => Number)
    phoneNumber: number;
}
