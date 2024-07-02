import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ResponseHelper } from "src/common/response";
import { statusCode } from "src/common/statusCodes";
import { ValidateAdminHeaders } from "./validateAdminHeaders.guard";
import { config } from "../../config";
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthAdmin implements CanActivate {

  constructor(
    private responseHelper: ResponseHelper,
    private StatusCode: statusCode,
    private validateHeaders: ValidateAdminHeaders,
  ) { }

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    const response: any = context.switchToHttp().getResponse();
    const next: any = context.switchToHttp().getNext();

    const error: any = this.validateHeaders.validateAdminHeader(request.headers);

    if (error) {
      this.responseHelper.error(response, error, request.headers.language);
      return Promise.resolve(false); // Return false since canActivate returns a Promise<boolean>
    }

    if (request.skip) {
      return Promise.resolve(true); // Return true since canActivate returns a Promise<boolean>
    }

    let token = request.headers.auth_token;
    try {
      const decoded: any = jwt.verify(token, config.jwtSecretKey);
      console.log('Decoded JWT:', decoded);

      if (decoded && decoded.user_id) {
        request['user_id'] = decoded.user_id
        console.log("Hi--->", request.user_id);
        return Promise.resolve(true);
      } else if (decoded && decoded.device_token) {
        request.device_token = decoded.device_token;
        return Promise.resolve(true);
      } else {
        console.log(`\nAdminValidation decode not found or undefined ->>`);
        this.responseHelper.error(response, 'TOKEN_MALFORMED');
        return Promise.resolve(false);
      }
    } catch (error) {
      console.log(`\nAdminValidation jwt.verify error ->> ${error}`);
      this.responseHelper.error(response, 'TOKEN_EXPIRED');
      return Promise.resolve(false);
    }
  }

}
