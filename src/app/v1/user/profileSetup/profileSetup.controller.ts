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
} from "@nestjs/common";
import { ResponseHelper } from "src/common/response";
import { statusCode } from "src/common/statusCodes";
import { ProfileSetupService } from "./profileSetup.service";
import { NonAuthAdmin } from "src/guard/nonAuthAdmin.guard";
import { Request, Response } from "express";
import { OtpVerifyDto } from "./dto parth/otpVerify.dto";
import { AuthAdmin } from "src/guard/authAdmin.guard";
import bodyParser from "body-parser";
import { DeleteUserDto } from "./dto parth/deleteUser.dto";
import { GetUserById } from "./dto parth/getUserById.dto";
import { EditUserDto } from "./dto parth/editUser.dto";

@Controller({ path: "/user", version: "1" })
export class ProfileSetupController {
  constructor(
    @Inject(ProfileSetupService)
    private ProfileSetupService: ProfileSetupService,
    private readonly response: ResponseHelper,
    private readonly statuscode: statusCode
  ) {}

  @Post("/otpVerify")
  @UseGuards(NonAuthAdmin)
  async otpVerify(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: OtpVerifyDto
  ): Promise<any> {
    try {
      const data = await this.ProfileSetupService.otpVerify(body);
      await this.response.success(res, "OTP_VERIFIED", data, this.statuscode.success);
    } catch (error) {
      console.log(` otp verify controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error);
    }
  }

  @Delete("deleteUser")
  @UseGuards(AuthAdmin)
  async deleteUser(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: DeleteUserDto,
  ): Promise<any> {
    try {
      if (req.user_id) {
        body.user_id = req.user_id;
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
  @UseGuards(AuthAdmin)
  async editUser(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: EditUserDto
  ): Promise<any> {
    try {
      if (req.user_id) {
        body.user_id = req.user_id;
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
  @UseGuards(AuthAdmin)
  async getUserById(
    @Req() req: Request,
    @Res() res: Response,
    @Query() params: GetUserById
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
