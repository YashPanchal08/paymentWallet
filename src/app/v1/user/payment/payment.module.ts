import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NonAuthAdmin } from "src/guard/nonAuthAdmin.guard";
import { ValidateAdminHeaders } from "src/guard/validateAdminHeaders.guard";
import { ValidateHeaders } from "src/guard/validateUserHeaders.guard";
import { ResponseHelper } from "src/common/response";
import { statusCode } from "src/common/statusCodes";
import { passwordHasing } from "src/common/passwordHashing";
import { Token } from "src/common/getJwtToken";
import { Mailer } from "src/common/mailer";
import { Otp } from "src/common/generateOtp";
import { FileValidators } from "src/common/Validators";
import { ValidateFilePipe } from "src/common/ValidateFile";
import { UserEntity } from "src/entites/user.entity";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { AccountEntity } from "src/entites/account.entity";
import { PaymentEntity } from "src/entites/payment.entity";
import { SplitEntity } from "src/entites/split.entity";
import { cronJob } from "src/common/cron.job";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, AccountEntity,PaymentEntity,SplitEntity])],
    controllers: [PaymentController],
    providers: [
        PaymentService,
        NonAuthAdmin,
        ValidateAdminHeaders,
        ValidateHeaders,
        ResponseHelper,
        statusCode,
        passwordHasing,
        Token,
        Mailer,
        Otp,
        FileValidators,
        ValidateFilePipe,
        cronJob
    ],
    exports: [],
})
export class PaymentModule { }
