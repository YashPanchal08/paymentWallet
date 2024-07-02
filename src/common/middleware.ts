// jwtUserMiddleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class JwtUserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.body && req.user_id) {
      // If user_id is already set in the body, move to the next middleware
      return next();
    }
    if (req.user_id) {
      req.body.user_id = req.user_id;
    }
    next();
  }
}
