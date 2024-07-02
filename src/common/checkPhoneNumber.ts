import { NotFoundException, UnauthorizedException } from "@nestjs/common"

export const checkPhoneNumber = (number: any) => {

    if (number.length === 0) {
        throw new NotFoundException("USER_MOBILE_NOTFOUND")
    }

    if(typeof number == 'string'){
        throw new NotFoundException("STRING_NOT_ACCEPT")
    }

    number = number.toString()

    if (number.length === 10) {
        return parseInt(number)
    }
    else {
        throw new UnauthorizedException("ENTER_VALID_NUMBER")
    }

}