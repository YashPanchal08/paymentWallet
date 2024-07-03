const jwt = require('jsonwebtoken')
import { config } from '../../config'
export class Token {

  getJwtToken(user_id: any): Promise<any> { // user_type - 1 - passenger user, 2 - driver user
    return new Promise((resolve, reject) => {
      try {
        // let expirationTime = is_admin ? config.jwtExpiryAdminTime : config.jwtExpiryUserTime,
        let sign = {
          user_id
        };

        let token = jwt.sign(sign, config.jwtSecretKey, {
          expiresIn: '1d'
        });
        return resolve(token);
      } catch (error) {
        return reject(error);
      }
    });
  }
}