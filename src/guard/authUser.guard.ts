// import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
// import { ResponseHelper } from "src/common/response";
// import { statusCode } from "src/common/statusCodes";
// import { ValidateHeaders } from "./validateUserHeaders.guard";
// import { config } from "../../config"
// import * as jsonwebtoken from 'jsonwebtoken';
// const { sign, decode, verify } = jsonwebtoken;


// @Injectable()
// export class AuthUser implements CanActivate {

//     constructor(
//         private responseHelper: ResponseHelper,
//         private StatusCode: statusCode,
//         private validateHeaders: ValidateHeaders,
//     ) { }

//     canActivate(context: ExecutionContext): any {

//         const request: any = context.switchToHttp().getRequest();
//         const response: any = context.switchToHttp().getResponse();
//         const error: any = this.validateHeaders.validateHeader(request.headers)

//         if (error) {
//             response.error(response, 'INVALID_REQUEST_HEADERS', request.headers.language);
//         } else {
//             verify(request.headers.auth_token, config.jwtSecretKey, (error: any, decoded: any) => {
//                 console.log(`\nAuthValidation error ->> ${error} decoded ->> ${JSON.stringify(decoded)}`);

//                 if (error) {
//                     if (error.name === 'TokenExpiredError' && request.skip) {
//                         let decoded = decode(request.headers.auth_token);

//                         console.log(`\nAuthValidation decoded ->> ${decoded} token ->> ${request.headers.auth_token}`);
//                         request['userId'] = decoded.user_id;
//                         console.log("UserId--------------->", request.userId);
//                         return true
//                         //   module.exports.isUserActive(request, response, next);
//                         // next();
//                     } else {
//                         if (request.route.path === '/refreshToken') {
//                             return true
//                         } else {
//                             this.responseHelper.error(response, error, this.StatusCode.error)
//                         }
//                     }
//                 } else if (decoded && decoded.user_id) {
//                     console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
//                     request['userId'] = decoded.user_id;
//                     console.log(request.userId);
//                     // module.exports.isUserActive(request, response, next);
//                     return true
//                 } else {
//                     console.log(`auth validator user_id -->>${decoded.user_id}`);

//                     this.responseHelper.error(response, error, this.StatusCode.error)
//                     return true
//                 }
//             });
//         }
//     }

// }

import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ResponseHelper } from "src/common/response";
import { statusCode } from "src/common/statusCodes";
import { ValidateHeaders } from "./validateUserHeaders.guard";
import { config } from "../../config";
import * as jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class AuthUser implements CanActivate {

    constructor(
        private responseHelper: ResponseHelper,
        private StatusCode: statusCode,
        private validateHeaders: ValidateHeaders,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: any = context.switchToHttp().getRequest();
        const response: any = context.switchToHttp().getResponse();

        const error = this.validateHeaders.validateHeader(request.headers);

        if (error) {
            this.responseHelper.error(response, 'INVALID_REQUEST_HEADERS', this.StatusCode.error);
            return false;
        }

        try {
            const decoded: any = await new Promise((resolve, reject) => {
                jsonwebtoken.verify(request.headers.auth_token, config.jwtSecretKey, (err, decoded) => {
                    if (err) reject(err);
                    resolve(decoded);
                });
            });

            if (decoded && decoded.user_id) {
                request.userId = decoded.user_id;
                return true;
            } else {
                this.responseHelper.error(response, 'Invalid token', this.StatusCode.unauthorized);
                return false;
            }
        } catch (error) {
            this.responseHelper.error(response, error.message, this.StatusCode.error);
            return false;
        }
    }
}
