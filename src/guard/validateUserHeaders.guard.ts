import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { ResponseHelper } from "src/common/response";
import { statusCode } from "src/common/statusCodes";
const semver = require('semver');
import { config } from "../../config"
// console.log(semver);
@Injectable()
export class ValidateHeaders {

    constructor(@Inject(ResponseHelper) private responseHelper: ResponseHelper,
        private StatusCode: statusCode
    ) { }

    public validateHeader(headers: any): any {

        let error: any;

        if (!headers.auth_token) {
            error = {
                param: 'auth_token',
                type: 'required'
            };
        }

        else if (!headers.device_id) {
            error = {
                param: 'device_id',
                type: 'required'
            };
        } else if (!headers.device_type) {
            error = {
                param: 'device_type',
                type: 'required'
            } //'0' for IOS ,'1' for android 
        } else if (!(headers.device_type == 0 || headers.device_type == 1)) {
            error = {
                param: 'device_type should be 0 or 1',
                type: 'required'
            };
        } else if (!headers.app_version) {
            error = 'APP_VERSION_MISSING';
        }
        else if (!headers.os) {
            error = {
                param: 'os',
                type: 'required'
            };
        }
        else {
            let version = headers.app_version,
                currentAppVersion = config.appVersion,
                tmp_version = version.split('.');

            tmp_version = tmp_version.length < 3 ? tmp_version.concat(['0', '0', '0']) : tmp_version;
            tmp_version.splice(3);
            version = tmp_version.join('.');

            if (semver.valid(version) === null) {
                error = 'INVALID_APP_VERSION';
            } else {
                if (semver.satisfies(version, `>= ${currentAppVersion}`)) { } else {
                    error = 'UPGRADE_APP';
                }
            }
        }
        return error;
    }
}