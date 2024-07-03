import {  Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entites/user.entity";
import { Repository } from "typeorm";
import { Otp } from "src/common/generateOtp";
import { DeviceRelationEntity } from "src/entites/deviceRelation.entity";
import { Token } from "src/common/getJwtToken";
import { AccountEntity } from "src/entites/account.entity";


@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
    @InjectRepository(AccountEntity) private accountRepository: Repository<AccountEntity>,
    private otp: Otp,
    private token: Token
  ) { }


}
