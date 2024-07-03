import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entites/user.entity";
import { Repository } from "typeorm";
import { OtpVerifyDto } from "./dto parth/otpVerify.dto";

import { profileSetupDto } from "./dto/profileSetupDto";
import { Otp } from "src/common/generateOtp";
import { DeviceRelationEntity } from "src/entites/deviceRelation.entity";
import { DeviceInfoDto } from "./dto/DeviceInfoDto";


@Injectable()
export class ProfileSetupService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(DeviceRelationEntity) private deviceRepository: Repository<DeviceRelationEntity>,
        private otp: Otp
    ) { }


    // async otpVerify(body: OtpVerifyDto): Promise<void> {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let { mobileNumber, otp } = body
    //             const userDetails = await this.userRepository.findOne({
    //                 where: { mobileNumber: mobileNumber }
    //             }


    async login(body: any, headers: DeviceInfoDto): Promise<void> {

        return new Promise(async (resolve, reject) => {
            try {

                const { phoneNumber } = body

                const isExistiongUser = await this.userRepository.findOne({
                    where: {
                        mobileNumber: phoneNumber
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




            } catch (error) {

                console.log(`Add page servioce error ${error}`);
                reject(error)

            }

        })

    }

    // async getUserById(body: any): Promise<void> {

    //                     return new Promise(async (resolve, reject) => {
    //                         try {

    //                             if (!userDetails) {
    //                                 throw new ConflictException('USER_NOT')
    //                             }
    //                             else if (otp != userDetails.otp) {
    //                                 throw new ConflictException('USER_INVALID_OTP')
    //                             }
    //                             else {
    //                                 await this.userRepository.update(
    //                                     { mobileNumber: mobileNumber },
    //                                     { otp: null }
    //                                 )
    //                             }

    //                         } catch (error) {
    //                             console.log(`otp verify servioce error ${error}`);
    //                             reject(error);
    //                         }
    //                     });
    //                 }

    async deleteUser(body: any): Promise<void> {
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
            } catch (error) {
                console.log(`delete user By Id servioce error ${error}`);
                reject(error);
            }
        });
    }

    async editUser(body: any): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId, fullName, email, } = body
                const user = await this.userRepository.findOne({
                    where: { userId: userId }
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
            } catch (error) {
                console.log(`edit user servioce error ${error}`);
                reject(error);
            }
        });
    }

    async getUserById(body: any): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const { userId } = body
                const user = await this.userRepository.findOne({
                    where: { userId: userId }
                })
                if (!user) {
                    throw new ConflictException("USER_NOT")
                }
                resolve({
                    userId: user.userId,
                    fullName: user.fullName,
                    email: user.email
                })
            } catch (error) {
                console.log(`get user by Id servioce error ${error}`);
                reject(error);
            }
        });
    }


}