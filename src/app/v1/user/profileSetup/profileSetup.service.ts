import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entites/user.entity";
import { Repository } from "typeorm";
import { OtpVerifyDto } from "./dto parth/otpVerify.dto";

@Injectable()
export class ProfileSetupService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>
  ) {}

  async otpVerify(body: OtpVerifyDto): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        let { mobileNumber, otp } = body
        const userDetails = await this.userRepository.findOne({
          where: {mobileNumber :mobileNumber}
        })

        if(!userDetails){
          throw new ConflictException('USER_NOT')
        }
        else if(otp != userDetails.otp){
          throw new ConflictException('USER_INVALID_OTP')
        }
        else {
          await this.userRepository.update(
          {mobileNumber :mobileNumber},
          {otp : null}
        )
        }

      } catch (error) {
        console.log(`otp verify servioce error ${error}`);
        reject(error);
      }
    });
  }

  async deleteUser(body: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const { userId } = body
        const user = await this.userRepository.findOne({
          where:{userId: userId}
        })
        if(!user){
          throw new ConflictException("USER_NOT")
        }else{
          await this.userRepository.update(
            {userId: userId},
            {isArchived: 0}
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
        let { userId,fullName, email, } = body
        const user = await this.userRepository.findOne({
          where:{ userId: userId}
        })
        if(!user){
          throw new ConflictException('USER_NOT')
        }else if(user.fullName == fullName && user.email == email){
          throw new ConflictException("CANNOT_EDIT")
        }else{
          await this.userRepository.update(
            {userId: userId},
            {fullName: fullName, email: email}
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
          where:{userId: userId}
        })
        if(!user){
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
