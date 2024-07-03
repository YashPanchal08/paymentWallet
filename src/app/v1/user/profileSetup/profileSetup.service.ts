import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entites/user.entity";
import { Repository } from "typeorm";
import { Otp } from "src/common/generateOtp";
import { DeviceRelationEntity } from "src/entites/deviceRelation.entity";
import { DeviceInfoDto } from "./dto/DeviceInfoDto";
import { Token } from "src/common/getJwtToken";
import { AccountEntity } from "src/entites/account.entity";
import { OtpVerifyDto } from "./dto/otpVerify.dto";
import { loginDto } from "./dto/loginDto";


@Injectable()
export class ProfileSetupService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(DeviceRelationEntity) private deviceRepository: Repository<DeviceRelationEntity>,
    @InjectRepository(AccountEntity) private accountRepository: Repository<AccountEntity>,
    private otp: Otp,
    private token: Token
  ) { }

  async login(body: loginDto, headers: DeviceInfoDto): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const { phoneNumber } = body;

        const isExistiongUser = await this.userRepository.findOne({
          where: {
            mobileNumber: phoneNumber,
          },
        });

        console.log("id--------->", isExistiongUser);

        const loginUserOtp = await this.otp.generateOTP(6);

        if (isExistiongUser) {
          console.log("uer--->");

          const isExistiongUser = await this.userRepository.findOne({
            where: {
              mobileNumber: phoneNumber,
              isArchived: 1
            }
          })

          let user;
          if (!isExistiongUser) {
            user = await this.userRepository.save({
              otp: parseInt(loginUserOtp),
              mobileNumber: phoneNumber,
            });
            console.log("user--------->", user.userId);
          }

          console.log("user.userId------------->", isExistiongUser);
          // console.log("user iDS--------------->", user);

          const id = isExistiongUser ? isExistiongUser.userId : user.userId;

          console.log("ID--------------------->", id);

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
            language: headers.language,
          });
        }

        if (!isNewDeviceToken) {
          await this.deviceRepository.save({
            fk_user_id: id,
            deviceId: headers.device_id,
            deviceType: headers.device_type,
            deviceToken: headers.device_token,
            appVersion: headers.app_version,
            os: headers.os,
            language: headers.language,
          });
        }

        return resolve();
      } catch (error) {
        console.log(`Add page servioce error ${error}`);
        reject(error);
      }
    });
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

  async otpVerify(body: OtpVerifyDto): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        let { mobileNumber, otp } = body;
        const userDetails = await this.userRepository.findOne({
          where: { mobileNumber: mobileNumber,isArchived: 1 },
        });


        if (!userDetails) {
          throw new ConflictException("USER_NOT");
        } else if (otp != userDetails.otp) {
          throw new ConflictException("USER_INVALID_OTP");
        } else {
          await this.userRepository.update(
            { mobileNumber: mobileNumber },
            { otp: null }
          );
        }

        let token = await this.token.getJwtToken(userDetails.userId)
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

  async userDetails(body: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let { user_id, fullName, email } = body;
        const balance = 500;

        const user = await this.accountRepository.findOne({
          where: { fk_user_id: user_id },
        });
        if (!user) {
          await this.accountRepository.save({
            fk_user_id: user_id,
            balance: balance,
          });
          if (!(typeof fullName == undefined || typeof email == undefined)) {
            await this.userRepository.update(
              { userId: user_id },
              { fullName: fullName, email: email }
            );
          }
        } else {
          throw new ConflictException("EXISTING_USER");
        }
        return resolve();
      } catch (error) {
        console.log(`edit user servioce error ${error}`);
        reject(error);
      }
    });
  }

  async deleteUser(body: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const { userId } = body;
        const user = await this.userRepository.findOne({
          where: { userId: userId },
        });
        if (!user) {
          throw new ConflictException("USER_NOT");
        } else {
          await this.userRepository.update(
            { userId: userId },
            { isArchived: 0 }
          );
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
        let { userId, fullName, email } = body;
        const user = await this.userRepository.findOne({
          where: { userId: userId,isArchived:1 },
        });
        if (!user) {
          throw new ConflictException("USER_NOT");
        } else if (user.fullName == fullName && user.email == email) {
          throw new ConflictException("CANNOT_EDIT");
        } else {
          await this.userRepository.update(
            { userId: userId },
            { fullName: fullName, email: email }
          );
        }
      } catch (error) {
        console.log(`edit user servioce error ${error}`);
        reject(error);
      }
    });
  }

  async getUserById(params: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { userId } = params;
        const user = await this.userRepository.findOne({
          where: { userId: userId,isArchived: 1 },
        });
        if (!user) {
          throw new ConflictException("USER_NOT");
        }
        resolve({
          userId: user.userId,
          fullName: user.fullName ? user.fullName : "",
          email: user.email ? user.email : "",
          mobileNumber: user.mobileNumber,
          isArchived: user.isArchived
        });
      } catch (error) {
        console.log(`get user by Id servioce error ${error}`);
        reject(error);
      }
    });
  }
}
