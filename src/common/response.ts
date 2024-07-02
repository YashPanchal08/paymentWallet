import { Request, Response } from 'express';
import * as messages from './messages.json'

// console.log(messages);

interface ResponseDto {
  code: number,
  status: string,
  message: any,
  data?: any
}

export class ResponseHelper {

  async success(res: any, msg: string, data: any, statusCode = 200): Promise<any> {

    let language = "en"

    let response: ResponseDto = {
      code: 1,
      status: 'SUCCESS',
      message: this.getMessage(msg, language),
      data: data ? data : {}
    }

    res.status(statusCode).json(response)
  }

  error(res: Response, msg: string, statusCode = 400): any {

    let language = "en"
    if (msg === 'DOES_NOT_MATCH_PASSWORD')
      statusCode = 403;

    if (msg == 'USER_BLOCKED')
      statusCode = 403;

    if (msg == 'TOKEN_EXPIRED')
      statusCode = 401;

    if (msg === 'UPGRADE_APP')
      statusCode = 403;

    let response: ResponseDto = {
      code: 0,
      status: 'FAIL',
      message: this.getMessage(msg, language),
    }

    res.status(statusCode).json(response)
  }

  getMessage(msg: any, language: string): any {

    let lang = language ? language : 'en'
    console.log("Message->", msg);

    if (msg.param && msg.param.includes('email')) {
      msg.param = 'email'
    }

    if (msg.type && msg.type.includes('and')) {
      return msg.message
    }

    if (msg.param && msg.type) {
      if (msg.type.includes('required')) {
        return messages[lang]['PARAMETERS_REQUIRED'].replace('@Parameter@', msg.param)
      } else if (msg.type.includes('min')) {
        return msg.message
      } else {
        return messages[lang]['INVALID_REQUEST_DATA'].replace('@Parameter@', msg.param)
      }
    } else if (msg.toString().includes('ReferenceError:')) {
      return messages[lang]['INTERNAL_SERVER_ERROR'];
    } else {
      return messages[lang][msg] || messages[lang]['SOMETHING_WENT_WRONG'];
    }

  }

}
