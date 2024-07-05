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
import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import { AuthUser } from "src/guard/authUser.guard";
import { getAllHistoryDto } from "./dto/getAllHistory.dto";
import { getAllHistoryByIdDto } from "./dto/getAllHistoryById.dto";
import { paymentDto } from "./dto/payment.dto";
import { settleUpDto } from "./dto/settleUp.dto";


@Controller({ path: "/user", version: "1" })
@UseGuards(AuthUser)
export class PaymentController {
    constructor(
        @Inject(PaymentService)
        private paymentService: PaymentService,
        private readonly response: ResponseHelper,
        private readonly statuscode: statusCode
    ) { }


    @Get('getAllHistory')
    async getAllHistory(
        @Req() req: any,
        @Res() res: Response,
        @Query() params: getAllHistoryDto): Promise<any> {
        try {
            if (req.userId) {
                params.userId = req.userId
            }
            console.log(params);
            let data = await this.paymentService.getAllHistory(params);
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

    @Get('getAllHistoryById')
    async getAllHistoryById(
        @Req() req: any,
        @Res() res: Response,
        @Query() params: getAllHistoryByIdDto): Promise<any> {
        try {
            if (req.userId) {
                params.userId = req.userId
            }
            console.log(params);
            let data = await this.paymentService.getAllHistoryById(params);
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

    @Get('getAllSplitHistory')
    async getAllSplitHistory(
        @Req() req: any,
        @Res() res: Response,
        @Query() params: getAllHistoryByIdDto): Promise<any> {
        try {
            if (req.userId) {
                params.userId = req.userId
            }
            console.log(params);
            let data = await this.paymentService.getAllSplitHistory(params);
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

    @Post('payment')
    async payment(
        @Req() req: any,
        @Res() res: Response,
        @Body() body: paymentDto): Promise<any> {
        try {
            if (req.userId) {
                body.userId = req.userId
            }
            let data = await this.paymentService.payment(body);
            await this.response.success(
                res,
                "PAYMENT_SUCCESS",
                data,
                this.statuscode.success
            );
        } catch (error) {
            console.log(` get User By Id user controller Error ${error}`);
            this.response.error(res, error.message, this.statuscode.error);
        }
    }

    @Post('settleUp')
    async settleUp(
        @Req() req: any,
        @Res() res: Response,
        @Body() body: settleUpDto): Promise<any> {
        try {
            if (req.userId) {
                body.userId = req.userId
            }
            let data = await this.paymentService.settleUp(body);
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