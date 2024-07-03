import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entites/user.entity";
import { Repository } from "typeorm";
import { OtpVerifyDto } from "./dto parth/otpVerify.dto";

import { profileSetupDto } from "./dto/profileSetupDto";
import { Otp } from "src/common/generateOtp";
import { DeviceRelationEntity } from "src/entites/deviceRelation.entity";
import { DeviceInfoDto } from "./dto/DeviceInfoDto";
import { Token } from "src/common/getJwtToken";
import { EditUserDto } from "./dto parth/editUser.dto";
import { DeleteUserDto } from "./dto parth/deleteUser.dto";


@Injectable()
export class ProfileSetupService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(DeviceRelationEntity) private deviceRepository: Repository<DeviceRelationEntity>,
        private otp: Otp,
        private token: Token
    ) { }


    async otpVerify(body: OtpVerifyDto): Promise<object> {
        return new Promise(async (resolve, reject) => {
            try {
                let { mobileNumber, otp } = body
                const userDetails = await this.userRepository.findOne({
                    where: { mobileNumber: mobileNumber, isArchived: 1 }
                })

                if (!userDetails) {
                    throw new ConflictException('USER_NOT')
                }
                else if (otp != userDetails.otp) {
                    throw new ConflictException('USER_INVALID_OTP')
                }
                else {
                    await this.userRepository.update(
                        { mobileNumber: mobileNumber },
                        { otp: null }
                    )
                }

                const isVerified = await this.userRepository.find({
                    where: {
                        mobileNumber: mobileNumber,
                        otp: null
                    }
                })

                console.log("", typeof userDetails.userId);

                let token;
                if (isVerified) {

                    token = await this.token.getJwtToken(userDetails.userId)

                }


                console.log("Is Verified-------------------->>>", isVerified);

                return resolve({
                    userId: userDetails.userId,
                    accessToken: token
                })

            } catch (error) {
                console.log(`otp verify servioce error ${error}`);
                reject(error);
            }
        });
    }

    async login(body: any, headers: DeviceInfoDto): Promise<void> {

        return new Promise(async (resolve, reject) => {
            try {

                const { phoneNumber } = body

                const isExistiongUser = await this.userRepository.findOne({
                    where: {
                        mobileNumber: phoneNumber,
                        isArchived: 1
                    }
                })

                console.log("id--------->", isExistiongUser);

                const loginUserOtp = await this.otp.generateOTP(6);

                if (isExistiongUser) {

                    console.log("uer--->");

                    await this.userRepository.save({
                        userId: isExistiongUser.userId,
                        otp: parseInt(loginUserOtp)
                    })
                }

                let user
                if (!isExistiongUser) {
                    user = await this.userRepository.save({
                        otp: parseInt(loginUserOtp),
                        mobileNumber: phoneNumber,
                    })
                    console.log("user--------->", user.userId);
                }

                console.log("user.userId------------->", isExistiongUser);
                // console.log("user iDS--------------->", user);


                const id = isExistiongUser ? isExistiongUser.userId : user.userId;

                console.log("ID--------------------->", id);

                const isNewDeviceToken = await this.deviceRepository.findOne({
                    where: {
                        fk_user_id: id,
                        deviceId: headers.device_id,
                        deviceToken: headers.device_token,
                    }
                })

                console.log("mobileNumber----------------->", isNewDeviceToken);

                if (isNewDeviceToken) {

                    await this.deviceRepository.save({
                        deviceRelationId: isNewDeviceToken.deviceRelationId,
                        fk_user_id: id,
                        deviceId: headers.device_id,
                        deviceType: headers.device_type,
                        deviceToken: headers.device_token,
                        appVersion: headers.app_version,
                        os: headers.os,
                        language: headers.language
                    })
                }


                if (!isNewDeviceToken) {

                    await this.deviceRepository.save({
                        fk_user_id: id,
                        deviceId: headers.device_id,
                        deviceType: headers.device_type,
                        deviceToken: headers.device_token,
                        appVersion: headers.app_version,
                        os: headers.os,
                        language: headers.language
                    })
                }


                return resolve()

            } catch (error) {

                console.log(`Add page servioce error ${error}`);
                reject(error)

            }

        })

    }

    async resendOtp(body: any): Promise<void> {

        return new Promise(async (resolve, reject) => {
            try {

                const existUser = await this.userRepository.findOne({
                    where: {
                        mobileNumber: body.phoneNumber,
                        isArchived: 1
                    }
                })

                if (!existUser) {
                    throw new NotFoundException("USER_MOBILE_NOTFOUND")
                }


                let otp = await this.otp.generateOTP(6)
                console.log(typeof otp);

                let number = parseInt(otp)

                // await this.mail.sendOTPMail(email, otp)

                await this.userRepository.save({
                    userId: existUser?.userId,
                    otp: number
                })

                return resolve()


            } catch (error) {

                console.log(`Add page servioce error ${error}`);
                reject(error)

            }

        })

    }

    async deleteUser(body: DeleteUserDto): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                const { userId } = body
                const user = await this.userRepository.findOne({
                    where: { userId: userId }
                })
                if (!user) {
                    throw new ConflictException("USER_NOT")
                } else {
                    await this.userRepository.update(
                        { userId: userId },
                        { isArchived: 0 }
                    )
                }

                console.log(user);

                if (user.isArchived == 0) {
                    throw new NotFoundException("USER_NOT")
                }

                return resolve()

            } catch (error) {
                console.log(`delete user By Id servioce error ${error}`);
                reject(error);
            }
        });
    }

    async editUser(body: EditUserDto): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId, fullName, email, } = body;

                console.log(userId);

                const user = await this.userRepository.findOne({
                    where: { userId: userId, isArchived: 1 }
                })

                if (!user) {
                    throw new ConflictException('USER_NOT')
                } else if (user.fullName == fullName && user.email == email) {
                    throw new ConflictException("CANNOT_EDIT")
                } else {
                    await this.userRepository.update(
                        { userId: userId },
                        { fullName: fullName, email: email }
                    )
                }

                return resolve()
            } catch (error) {
                console.log(`edit user servioce error ${error}`);
                reject(error);
            }
        });
    }

    async getUserById(params: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const { userId } = params
                const user = await this.userRepository.findOne({
                    where: { userId: userId, isArchived: 1 }
                })
                if (!user) {
                    throw new ConflictException("USER_NOT")
                }
                resolve({
                    userId: user.userId,
                    fullName: user.fullName ? user.fullName : "",
                    email: user.email ? user.email : "",
                    mobileNumber: user.mobileNumber,
                    isArchived: user.isArchived
                })
            } catch (error) {
                console.log(`get user by Id servioce error ${error}`);
                reject(error);
            }
        });
    }

}