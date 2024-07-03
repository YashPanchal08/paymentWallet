import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  Headers,
} from "@nestjs/common";
import { ResponseHelper } from "src/common/response";
import { statusCode } from "src/common/statusCodes";
import { ProfileSetupService } from "./profileSetup.service";
import { NonAuthAdmin } from "src/guard/nonAuthAdmin.guard";
import { Request, Response } from "express";
import { AuthAdmin } from "src/guard/authAdmin.guard";
import { DeleteUserDto } from "./dto/deleteUser.dto";
import { GetUserByIdDto } from "./dto/getUserById.dto";
import { EditUserDto } from "./dto/editUser.dto";
import { AuthUser } from "src/guard/authUser.guard";
import { OtpVerifyDto } from "./dto/otpVerify.dto";
import { UserDetailsDTo } from "./dto/enterDetails.dto";


@Controller({ path: "/user", version: "1" })
export class ProfileSetupController {
  constructor(
    @Inject(ProfileSetupService)
    private ProfileSetupService: ProfileSetupService,
    private readonly response: ResponseHelper,
    private readonly statuscode: statusCode
  ) { }

  @Post('/login')
  @UseGuards(NonAuthAdmin)
  async login(@Req() req: Request, @Res() res: Response, @Body() body: any, @Headers() headers: any): Promise<any> {
    try {

      const data = await this.ProfileSetupService.login(body, headers);
      await this.response.success(res, "OTP_SENT", data, this.statuscode.success)

    } catch (error) {
      console.log(` Add category controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error)

    }
  }

  @Post('/resendOtp')
  @UseGuards(NonAuthAdmin)
  async resendOtp(@Req() req: Request, @Res() res: Response, @Body() body: any): Promise<any> {
    try {

      const data = await this.ProfileSetupService.resendOtp(body);
      await this.response.success(res, "OTP_SENT", data, this.statuscode.success)

    } catch (error) {
      console.log(` Add category controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error)

    }
  }

  @Post("/otpVerify")
  @UseGuards(NonAuthAdmin)
  async otpVerify(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: OtpVerifyDto
  ): Promise<any> {
    try {
      const data = await this.ProfileSetupService.otpVerify(body);
      await this.response.success(
        res,
        "OTP_VERIFIED",
        data,
        this.statuscode.success
      );
    } catch (error) {
      console.log(` otp verify controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error);
    }
  }

  @Post("userDetails")
  @UseGuards(AuthUser)
  async userDetails(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: UserDetailsDTo
  ): Promise<any> {
    try {
      if (req.userId) {
        body.user_id = req.userId;
      }
      let data = await this.ProfileSetupService.userDetails(body);
      await this.response.success(
        res,
        "REGISTERED_SUCCESS",
        data,
        this.statuscode.success
      );
    } catch (error) {
      console.log(`\n user Details controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error);

    }
  }

  @Delete("deleteUser")
  @UseGuards(AuthUser)
  async deleteUser(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: DeleteUserDto
  ): Promise<any> {
    try {
      if (req.userId) {
        body.userId = req.userId;
      }
      let data = await this.ProfileSetupService.deleteUser(body);
      await this.response.success(
        res,
        "DELETE_USER",
        data,
        this.statuscode.success
      );
    } catch (error) {
      console.log(` delete user controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error);
    }
  }

  @Put("editUser")
  @UseGuards(AuthUser)
  async editUser(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: EditUserDto
  ): Promise<any> {
    try {
      if (req.userId) {
        body.userId = req.userId;
      }
      let data = await this.ProfileSetupService.editUser(body);
      await this.response.success(
        res,
        "EDIT_PROFILE_SUCCESS",
        data,
        this.statuscode.success
      );
    } catch (error) {
      console.log(` edit profile controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error);
    }
  }

  @Delete("getUserById")
  @UseGuards(AuthUser)
  async getUserById(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetUserByIdDto
  ): Promise<any> {
    try {
      let data = await this.ProfileSetupService.getUserById(params);
      await this.response.success(
        res,
        "SUCCESS",
        data,
        this.statuscode.success
      );
    } catch (error) {
      console.log(` get User By Id user controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error);
    }
  }

}