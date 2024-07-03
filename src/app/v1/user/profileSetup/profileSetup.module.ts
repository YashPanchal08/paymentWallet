import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NonAuthAdmin } from "src/guard/nonAuthAdmin.guard";
import { ValidateAdminHeaders } from "src/guard/validateAdminHeaders.guard";
import { ValidateHeaders } from "src/guard/validateUserHeaders.guard";
import { ResponseHelper } from "src/common/response";
import { statusCode } from "src/common/statusCodes";
import { passwordHasing } from "src/common/passwordHashing";
import { token } from "src/common/getJwtToken";
import { Mailer } from "src/common/mailer";
import { Otp } from "src/common/generateOtp";
import { FileValidators } from "src/common/Validators";
import { ValidateFilePipe } from "src/common/ValidateFile";
import { UserEntity } from "src/entites/user.entity";
import { ProfileSetupService } from "./profileSetup.service";
import { ProfileSetupController } from "./profileSetup.controller";
import { DeviceRelationEntity } from "src/entites/deviceRelation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity,DeviceRelationEntity])],
  controllers: [ProfileSetupController],
  providers: [
    ProfileSetupService,
    NonAuthAdmin,
    ValidateAdminHeaders,
    ValidateHeaders,
    ResponseHelper,
    statusCode,
    passwordHasing,
    token,
    Mailer,
    Otp,
    FileValidators,
    ValidateFilePipe,
  ],
  exports: [],
})
export class ProfileSetupModule {}
