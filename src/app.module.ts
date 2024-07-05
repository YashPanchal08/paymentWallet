import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { database } from "./config/pgsql.config";
import { NonAuthAdmin } from "./guard/nonAuthAdmin.guard";
import { ValidateAdminHeaders } from "./guard/validateAdminHeaders.guard";
import { ValidateHeaders } from "./guard/validateUserHeaders.guard";
import { ResponseHelper } from "./common/response";
import { statusCode } from "./common/statusCodes";
import { passwordHasing } from "./common/passwordHashing";
import { Token } from "./common/getJwtToken";
import { Mailer } from "./common/mailer";
import { Otp } from "./common/generateOtp";
import { FileValidators } from "./common/Validators";
import { ValidateFilePipe } from "./common/ValidateFile";
import { JwtUserMiddleware } from "./common/middleware";
import { ProfileSetupModule } from "./app/v1/user/profileSetup/profileSetup.module";
import { PaymentModule } from "./app/v1/user/payment/payment.module";
import { Cron, ScheduleModule } from "@nestjs/schedule";
import { cronJob } from "./common/cron.job";
import { UserEntity } from "./entites/user.entity";
import { AccountEntity } from "./entites/account.entity";
import { PaymentEntity } from "./entites/payment.entity";
import { SplitEntity } from "./entites/split.entity";


@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forRoot(database), ProfileSetupModule, PaymentModule, TypeOrmModule.forFeature([UserEntity, AccountEntity, PaymentEntity, SplitEntity])],
  controllers: [],
  providers: [
    NonAuthAdmin,
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtUserMiddleware).forRoutes("*"); // Apply globally
  }
}
