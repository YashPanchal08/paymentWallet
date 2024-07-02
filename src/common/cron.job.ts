import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { isSemVer } from "class-validator";
import { AccountEntity } from "src/entites/account.entity";
import { SplitEntity } from "src/entites/split.entity";
import { UserEntity } from "src/entites/user.entity";
import {
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from "typeorm";

@Injectable()
export class CronJob {
  constructor(
    @InjectRepository(SplitEntity)
    private splitRepository: Repository<SplitEntity>,
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>
  ) {}

  @Cron("*/2 * * * * *")
  checkTime() {
    console.log("\n --->>>heloo parth");
    this.checkSplit();
  }

  async checkSplit(): Promise<any> {
    // const splitAry = await this.splitRepository.find();
    // console.log("\n ---splitAry list ---->>>>>>>>", splitAry);

    // const today = new Date();
    // const sixDaysAgo = new Date(today);
    // sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);
    // const splitEntities = await this.splitRepository.find({
    //   where: { createdAt: LessThan(sixDaysAgo), isSettle: 1, splitAmount : MoreThanOrEqual(1) },
    // });
    // console.log("\n ---- time more than 6 days", splitEntities);

    // if (splitEntities && splitEntities.length > 0) {
    //   for (let i in splitEntities) {

    //     const isSettleUp = await this.accountRepository.find({
    //       where: { fk_user_id: splitEntities[i].fk_user_id },
    //     });

    //     const isSettleUpReciver = await this.accountRepository.find({
    //       where: { fk_user_id: splitEntities[i].fk_reciver_id },
    //     });

    //     console.log("\n --- is settle up >>> ---", isSettleUp, isSettleUpReciver);

    //     if (isSettleUp.length > 0) {
    //       const settleBalance = isSettleUp[i].balance - splitEntities[i].splitAmount;
    //       console.log("Settle Balance------->",settleBalance);
    //       await this.accountRepository.update(
    //         { fk_user_id: splitEntities[i].fk_reciver_id },
    //         { balance: settleBalance }
    //       );

    //       const debitBalance = isSettleUpReciver[i].balance + splitEntities[i].splitAmount;
    //       console.log("debitBalance",debitBalance);
    //       await this.accountRepository.update(
    //         { fk_user_id: splitEntities[i].fk_user_id },
    //         { balance: debitBalance }
    //       );

    //       await this.splitRepository.update(
    //         { splitId: splitEntities[i].splitId },
    //         { isSettle: 0, splitAmount: 0 }
    //       );
    //     }
    //   }
    // }

    const today = new Date();
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    const splitEntities = await this.splitRepository.find({
      where: { createdAt: LessThan(sixDaysAgo), isSettle: 1, splitAmount: MoreThanOrEqual(1),},
    });
    console.log("\n ---- time more than 6 days", splitEntities);

    if (splitEntities && splitEntities.length > 0) {
      for (const splitEntity of splitEntities) {
        const isSettleUp = await this.accountRepository.findOne({
          where: { fk_user_id: splitEntity.fk_user_id },
        });

        const isSettleUpReceiver = await this.accountRepository.findOne({
          where: { fk_user_id: splitEntity.fk_reciver_id },
        });

        console.log("\n --- is settle up >>> ---",isSettleUp,isSettleUpReceiver);

        if (isSettleUp) {
          const settleBalance = isSettleUp.balance - splitEntity.splitAmount;
          console.log("Settle Balance------->", settleBalance);

          await this.accountRepository.update(
            { fk_user_id: splitEntity.fk_reciver_id },
            { balance: settleBalance }
          );

          const debitBalance = isSettleUpReceiver.balance + splitEntity.splitAmount;
          console.log("debitBalance", debitBalance);
          
          await this.accountRepository.update(
            { fk_user_id: splitEntity.fk_user_id },
            { balance: debitBalance }
          );

          await this.splitRepository.update(
            { splitId: splitEntity.splitId },
            { isSettle: 0 , splitAmount: 0}
          );
        }
      }
    }


  }
}
