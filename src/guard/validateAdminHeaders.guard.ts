import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ResponseHelper } from "src/common/response";
import { statusCode } from "src/common/statusCodes";
const semver = require('semver');
import { config } from "../../config"
// console.log(semver);
@Injectable()
export class ValidateAdminHeaders {

    constructor(@Inject(ResponseHelper) private responseHelper: ResponseHelper,
        private StatusCode: statusCode
    ) { }

    public validateAdminHeader(headers: any): any {

        let error: any;

        if (!headers.auth_token) {
            error = {
                param: 'auth_token',
                type: 'required'
            };
        }
        // console.log(error);

        return error;
    }
}