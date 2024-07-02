import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ResponseHelper } from "src/common/response";
import { statusCode } from "src/common/statusCodes";
import { ValidateAdminHeaders } from "./validateAdminHeaders.guard";
import { config } from "../../config"
import { ValidateHeaders } from "./validateUserHeaders.guard";

@Injectable()
export class NonAuthAdmin implements CanActivate {

    constructor(
        private responseHelper: ResponseHelper,
        private StatusCode: statusCode,
        private validateHeaders: ValidateAdminHeaders,
    ) {}

    canActivate(context: ExecutionContext): boolean {

        const request: any = context.switchToHttp().getRequest();
        const response: any = context.switchToHttp().getResponse();
        const error: any = this.validateHeaders.validateAdminHeader(request.headers)
        if (error) {
            // console.log(error);
            this.responseHelper.error(response, error, this.StatusCode.error)
        }
        else if (request.headers.auth_token !== config.defaultAuthToken) {
            this.responseHelper.error(response, 'INVALID_TOKEN', this.StatusCode.invalidToken)
        }
        else {
            console.log(`nonAuthValidation req.body ->> `, request.body);
            return true
        }
    }

}