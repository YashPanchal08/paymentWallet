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


@Controller({ path: "/user", version: "1" })
export class PaymentController {
    constructor(
        @Inject(PaymentService)
        private PaymentService: PaymentService,
        private readonly response: ResponseHelper,
        private readonly statuscode: statusCode
    ) { }



}