import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  Headers,
} from "@nestjs/common";
import { ResponseHelper } from "src/common/response";
import { statusCode } from "src/common/statusCodes";
import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { AuthUser } from "src/guard/authUser.guard";
import { GetUserListDto } from "./dto/getUserList.dto";
import { PaymentHistoryDto } from "./dto/paymentHistory.dto";
import { PayDto } from "./dto/pay.dto";
import { PaymentHistoryByIdDto } from "./dto/paymentHistoryById.dto";
import { GetSplitHistoryDto } from "./dto/getSplitHistory.dto";
import { SettleUpDto } from "./dto/settleUp.dto";

@Controller({ path: "/user", version: "1" })
export class PaymentController {
  constructor(
    @Inject(PaymentService)
    private paymentService: PaymentService,
    private readonly response: ResponseHelper,
    private readonly statuscode: statusCode
  ) {}

  @Get("getUserList")
  @UseGuards(AuthUser)
  async getUserList(
    @Req() req: any,
    @Res() res: Response,
    @Query() params: GetUserListDto
  ): Promise<any> {
    try {
      if (req.userId) {
        params.userId = req.userId;
      }
      let data = await this.paymentService.getUserList(params);
      await this.response.success(
        res,
        "SUCCESS",
        data,
        this.statuscode.success
      );
    } catch (error) {
      console.log(`get User list user controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error);
    }
  }

  @Get("paymentHistory")
  @UseGuards(AuthUser)
  async paymentHistory(
    @Req() req: any,
    @Res() res: Response,
    @Query() params: PaymentHistoryDto
  ): Promise<any> {
    try {
      if (req.userId) {
        params.userId = req.userId;
      }
      let data = await this.paymentService.paymentHistory(params);
      await this.response.success(
        res,
        "SUCCESS",
        data,
        this.statuscode.success
      );
    } catch (error) {
      console.log(`\n payment History controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error);
    }
  }

  @Get("paymentHistoryById")
  @UseGuards(AuthUser)
  async paymentHistoryById(
    @Req() req: any,
    @Res() res: Response,
    @Query() params: PaymentHistoryByIdDto
  ): Promise<any> {
    try {
      if (req.userId) {
        params.userId = req.userId;
      }
      let data = await this.paymentService.paymentHistoryById(params);
      await this.response.success(
        res,
        "SUCCESS",
        data,
        this.statuscode.success
      );
    } catch (error) {
      console.log(`\n payment History by Id controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error);
    }
  }

  @Post("pay")
  @UseGuards(AuthUser)
  async pay(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: PayDto
  ): Promise<any> {
    try {
      if (req.userId) {
        body.userId = req.userId;
      }
      let data = await this.paymentService.pay(body);
      await this.response.success(
        res,
        "PAYMENT_SUCCESS",
        data,
        this.statuscode.success
      );
    } catch (error) {
      console.log(`\n pay controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error);
    }
  }

  @Get("getSplitHistory")
  @UseGuards(AuthUser)
  async getSplitHistory(
    @Req() req: any,
    @Res() res: Response,
    @Query() params: GetSplitHistoryDto
  ): Promise<any> {
    try {
      if (req.userId) {
        params.userId = req.userId;
      }
      let data = await this.paymentService.getSplitHistory(params);
      await this.response.success(
        res,
        "SUCCESS",
        data,
        this.statuscode.success
      );
    } catch (error) {
      console.log(`\n get Split History controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error);
    }
  }

  @Delete("settleUp")
  @UseGuards(AuthUser)
  async settleUp(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: SettleUpDto
  ): Promise<any> {
    try {
      if (req.userId) {
        body.userId = req.userId;
      }
      let data = await this.paymentService.settleUp(body);
      await this.response.success(
        res,
        "PAYMENT_SETTLEUP",
        data,
        this.statuscode.success
      );
    } catch (error) {
      console.log(`\n settle Up controller Error ${error}`);
      this.response.error(res, error.message, this.statuscode.error);
    }
  }

}
