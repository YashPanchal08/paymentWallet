import { NotFoundException, UnauthorizedException } from "@nestjs/common"

export const checkOtp = (number: any) => {

    if (number.length === 0) {
        throw new NotFoundException("USER_MOBILE_NOTFOUND")
    }

    if (typeof number == 'string') {
        throw new NotFoundException("STRING_NOT_ACCEPT")
    }

    return number

}