import { Injectable, NotFoundException } from "@nestjs/common";
import { Cron } from '@nestjs/schedule';
import { CronExpression } from "./cron-expression.enum";
import { Scheduled } from "nestjs-cron";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entites/user.entity";
import { AccountEntity } from "src/entites/account.entity";
import { SplitEntity } from "src/entites/split.entity";
import { PaymentEntity } from "src/entites/payment.entity";
import { And, LessThan, LessThanOrEqual, MoreThan, Repository } from "typeorm";

@Injectable()
@Scheduled()
export class cronJob {

    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(AccountEntity) private accountRepository: Repository<AccountEntity>,
        @InjectRepository(SplitEntity) private splitRepository: Repository<SplitEntity>,
        @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,) { }

    @Cron('0 23 */6 * * *', { name: "thisCronJob" }) //every 6 days
    checkSplitDuePayment() {
        console.log("cron running ------");
        this.splitPaymentDue();
    }

    async splitPaymentDue(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const sixDaysAgo = new Date();
                sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
                console.log(sixDaysAgo);
                const unsettledSplits = await this.splitRepository.find({
                    where: {
                        isSettleUp: 0,
                        createdAt: LessThan(sixDaysAgo),
                    }
                });
                console.log(unsettledSplits);
                for (let unsettleBill of unsettledSplits) {  /* Loop to update account balance */

                    const isUserExits = await this.accountRepository.findOne({
                        where: {
                            fk_user_id: unsettleBill.fk_user_id,
                        }
                    })

                    const isReciverExits = await this.accountRepository.findOne({
                        where: {
                            fk_user_id: unsettleBill.fk_reciver_id,
                        }
                    })

                    if (!isUserExits || !isReciverExits) {
                        throw new NotFoundException("USER_NOT")
                    }

                    const finalAmount = isReciverExits.balance - unsettleBill.splitAmount
                    await this.accountRepository.update({ accountId: isReciverExits.accountId }, { balance: finalAmount })

                    await this.accountRepository.update({ accountId: isUserExits.accountId }, { balance: (isUserExits.balance + unsettleBill.splitAmount) })

                    await this.splitRepository.update({ splitId: unsettleBill.splitId }, { isSettleUp: 1 })

                    // console.log(finalAmount);

                    return resolve({})
                }
            } catch (error) {
                console.log("Err occur in split payment", error);
                reject(error)
            }
        })
    }
}
