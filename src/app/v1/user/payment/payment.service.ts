import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entites/user.entity";
import { Repository } from "typeorm";
import { Otp } from "src/common/generateOtp";
import { DeviceRelationEntity } from "src/entites/deviceRelation.entity";
import { Token } from "src/common/getJwtToken";
import { AccountEntity } from "src/entites/account.entity";
import { PaymentEntity } from "src/entites/payment.entity";
import * as moment from "moment";
import { SplitEntity } from "src/entites/split.entity";
import { SettleUpDto } from "./dto/settleUp.dto";
import { SettleUpEntity } from "src/entites/settleUp.entity";
@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(AccountEntity)
    private accountRepository: Repository<AccountEntity>,
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(SplitEntity)
    private splitRepository: Repository<SplitEntity>,
    private otp: Otp,
    private token: Token,
  ) {}

  date: any = moment().format("YYYY-MM-DD hh:mm:ss.SSS");

  async getUserList(params: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { userId } = params;
        const user = await this.userRepository.findOne({
          where: { userId: userId, isArchived: 1 },
        });
        if (!user) {
          throw new ConflictException("USER_NOT");
        }
        const userList = await this.userRepository
          .createQueryBuilder()
          .where('"isArchived" = :isArchived', { isArchived: 1 })
          .andWhere('"userId" != :userId', { userId: userId })
          .select([`"userId"`, `"fullName"`, `"mobileNumber"`])
          .getRawMany();

        console.log("--------------------------", userList);
        return resolve(userList);
      } catch (error) {
        console.log(`get user list servioce error ${error}`);
        reject(error);
      }
    });
  }

  async paymentHistory(params: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { userId } = params;
        const user = await this.userRepository.findOne({
          where: { userId: userId, isArchived: 1 },
        });
        if (!user) {
          throw new ConflictException("USER_NOT");
        }

        // const userHistory = await this.userRepository
        //   .createQueryBuilder('u')
        //   .leftJoinAndSelect(PaymentEntity,'p','p.fk_user_id = u."userId"')
        //   .leftJoinAndSelect(UserEntity,'uu','uu."userId" = p."fk_reciver_id"')
        //   .where('u."isArchived" = :isArchived',{ isArchived: 1 })
        //   .andWhere('p.fk_user_id = :userId',{ userId : userId})
        //   .orWhere('p.fk_reciver_id = :userId',{ userId : userId})
        //   .select([
        //     `p."paymentId" AS "paymentHistoryId"`,
        //     `p."fk_user_id" AS "paidBy"`,
        //     `p."fk_reciver_id" AS "receiveBy"`,
        //     `p."amount" AS "paidAmount"`,
        //     `p."updatedAt" AS "transactionDate"`,
        //     `u."fullName" AS "payerName"`,
        //     `uu."fullName" AS "receiverName"`,
        //   ])
        //   .getRawMany()

        const userHistory: any = await this.paymentRepository
          .createQueryBuilder("p")
          .leftJoinAndSelect(UserEntity, "uu", 'p.fk_reciver_id = uu."userId"')
          .leftJoinAndSelect(UserEntity, "u", 'u."userId" = p."fk_user_id"')
          .where('u."isArchived" = :isArchived', { isArchived: 1 })
          .andWhere("p.fk_user_id = :userId", { userId: userId })
          .orWhere("p.fk_reciver_id = :userId", { userId: userId })
          .select([
            `p."paymentId" AS "paymentHistoryId"`,
            `p."fk_user_id" AS "paidBy"`,
            `p."fk_reciver_id" AS "receiveBy"`,
            `p."amount" AS "paidAmount"`,
            `p."updatedAt" AS "transactionDate"`,
            `u."fullName" AS "payerName"`,
            `uu."fullName" AS "receiverName"`,
          ])
          .getRawMany();

        return resolve(userHistory);
      } catch (error) {
        console.log(`\n payment History servioce error ${error}`);
        reject(error);
      }
    });
  }

  async paymentHistoryById(params: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { userId, receiverId } = params;
        const user = await this.userRepository.findOne({
          where: { userId: userId, isArchived: 1 },
        });
        if (!user) {
          throw new ConflictException("USER_NOT");
        }

        const paymentHistory: any = await this.paymentRepository
          .createQueryBuilder("p")
          .leftJoinAndSelect(UserEntity, "uu", 'p.fk_reciver_id = uu."userId"')
          .leftJoinAndSelect(UserEntity, "u", 'u."userId" = p."fk_user_id"')
          .where('u."isArchived" = :isArchived', { isArchived: 1 })
          .andWhere("p.fk_user_id = :userId", { userId: userId })
          .andWhere("p.fk_reciver_id = :receiverId", { receiverId: receiverId })
          .select([
            `p."paymentId" AS "paymentHistoryId"`,
            `p."fk_user_id" AS "paidBy"`,
            `p."fk_reciver_id" AS "receiveBy"`,
            `p."amount" AS "paidAmount"`,
            `p."updatedAt" AS "transactionDate"`,
            `u."fullName" AS "payerName"`,
            `uu."fullName" AS "receiverName"`,
          ])
          .getRawMany();

        return resolve(paymentHistory);
      } catch (error) {
        console.log(`\n payment History by Id servioce error ${error}`);
        reject(error);
      }
    });
  }

  async pay(body: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { userId, receiverId, amount, splitId } = body;

        const checkPayerIsExists = await this.userRepository.findOne({
          where: { userId: userId, isArchived: 1 },
        });
        if (!checkPayerIsExists) {
          throw new ConflictException("USER_NOT");
        }

        const checkReceiverIsExists = await this.userRepository.findOne({
          where: { userId: receiverId, isArchived: 1 },
        });
        if (!checkReceiverIsExists) {
          throw new ConflictException("RECEIVER_NOT_FOUND");
        }
        if (userId == receiverId) {
          throw new ConflictException("NOT_POSSIBLE");
        }

        /*------------------------------- pay------------------------------- */
        const payAmount = await this.accountRepository.findOne({
          where: { fk_user_id: userId },
        });
        console.log("---payamount--->>>", payAmount.balance);

        const addAmount = await this.accountRepository.findOne({
          where: { fk_user_id: receiverId },
        });
        console.log("---payamount--->>>", addAmount.balance);

        if (payAmount.balance >= amount) {
          await this.paymentRepository.save({
            fk_user_id: userId,
            fk_reciver_id: receiverId,
            amount: amount,
          });
          const leftBalance = payAmount.balance - amount;
          await this.accountRepository.update(
            { fk_user_id: userId },
            { balance: leftBalance }
          );
          const addBalance = addAmount.balance + amount;
          await this.accountRepository.update(
            { fk_user_id: receiverId },
            { balance: addBalance }
          );
        } else {
          throw new ConflictException("INSUFFICIENT_BALANCE");
        }

        /*-----------------------------split amount------------------------------------------------*/
        console.log("\n--------split array----->>>>>", splitId);

        if (splitId && splitId.length > 0) {
          for (let i in splitId) {
            console.log("i------------->", splitId[i]);
            const user = await this.userRepository
              .createQueryBuilder()
              .where('"userId" = :item', { item: splitId[i] })
              .andWhere('"userId" != :receiverId', { receiverId: receiverId })
              .getOne();

            if (!user) {
              console.log("userId not found:-->", splitId[i]);
              throw new NotFoundException("USER_NOT");
            }

            const splitAmount = amount / splitId.length;
            console.log("splir amount--->>", splitAmount);

            // for (let i of splitId) {
            if (splitId[i] == userId) {
            } else {
              await this.splitRepository.save({
                fk_user_id: userId,
                fk_reciver_id: splitId[i],
                splitAmount: splitAmount,
              });
            }
          }
          // }
        }

        return resolve({});
      } catch (error) {
        console.log(`\n pay service error ${error}`);
        reject(error);
      }
    });
  }

  async getSplitHistory(params: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const { userId } = params;
        const user = await this.userRepository.findOne({
          where: { userId: userId, isArchived: 1 },
        });
        if (!user) {
          throw new ConflictException("USER_NOT");
        }

        const getSplit: any = await this.splitRepository
          .createQueryBuilder("s")
          .leftJoinAndSelect(UserEntity, "u", 'u."userId" = s."fk_user_id"')
          .leftJoinAndSelect(
            UserEntity,
            "uu",
            'uu."userId" = s."fk_reciver_id"'
          )
          .where('u."isArchived" = :isArchived', { isArchived: 1 })
          .andWhere("s.fk_user_id = :userId", { userId: userId })
          .select([`SUM(s."splitAmount") AS "levana"`])
          .getRawMany();

        const debitSplit: any = await this.splitRepository
          .createQueryBuilder("s")
          .leftJoinAndSelect(UserEntity, "u", 'u."userId" = s."fk_user_id"')
          .leftJoinAndSelect(
            UserEntity,
            "uu",
            'uu."userId" = s."fk_reciver_id"'
          )
          .where('u."isArchived" = :isArchived', { isArchived: 1 })
          .andWhere("s.fk_reciver_id = :userId", { userId: userId })
          .select([`SUM(s."splitAmount") AS "devu"`])
          .getRawMany();

        // const getSplitHistory: any = await this.splitRepository
        //   .createQueryBuilder("s")
        //   .leftJoinAndSelect(UserEntity, "u", 'u."userId" = s."fk_user_id"')
        //   .leftJoinAndSelect(
        //     UserEntity,
        //     "uu",
        //     'uu."userId" = s."fk_reciver_id"'
        //   )
        //   .where('u."isArchived" = :isArchived', { isArchived: 1 })
        //   .andWhere("s.fk_user_id = :userId", { userId: userId })
        //   // .andWhere("s.fk_reciver_id = :userId", { userId: userId })
        //   .select([
        //     `s."splitId" AS "splitId"`,
        //     `s."fk_user_id" AS "splitBy"`,
        //     `s."fk_reciver_id" AS "receivedBy"`,
        //     `s."splitAmount" AS "splitAmount"`,
        //     `s."updatedAt" AS "transactionDate"`,
        //     `u."fullName" AS "payerName"`,
        //     `uu."fullName" AS "receiverName"`,
        //   ])
        //   .getRawMany();

        // const debitSplitHistory: any = await this.splitRepository
        //   .createQueryBuilder("s")
        //   .leftJoinAndSelect(UserEntity, "u", 'u."userId" = s."fk_user_id"')
        //   .leftJoinAndSelect(
        //     UserEntity,
        //     "uu",
        //     'uu."userId" = s."fk_reciver_id"'
        //   )
        //   .where('u."isArchived" = :isArchived', { isArchived: 1 })
        //   .andWhere("s.fk_reciver_id = :userId", { userId: userId })
        //   .select([
        //     `s."splitId" AS "splitId"`,
        //     `s."fk_user_id" AS "splitBy"`,
        //     `s."fk_reciver_id" AS "receivedBy"`,
        //     `s."splitAmount" AS "splitAmount"`,
        //     `s."updatedAt" AS "transactionDate"`,
        //     `u."fullName" AS "payerName"`,
        //     `uu."fullName" AS "receiverName"`,
        //   ])
        //   .getRawMany();

        // const get = await this.splitRepository
        // .createQueryBuilder("s")
        // .leftJoinAndSelect(UserEntity, "u", 'u."userId" = s."fk_user_id"')
        // .leftJoinAndSelect(UserEntity,"uu",'uu."userId" = s."fk_reciver_id"')
        // .where('u."isArchived" = :isArchived', { isArchived: 1 })
        // .andWhere("s.fk_user_id = :userId", { userId: userId })
        // .select([
        //   `s."splitId" AS "splitId"`,
        //   `s."fk_user_id" AS "splitBy"`,
        //   `s."fk_reciver_id" AS "receivedBy"`,
        //   `s."splitAmount" AS "splitAmount"`,
        //   `s."updatedAt" AS "transactionDate"`,
        //   `u."fullName" AS "payerName"`,
        //   `uu."fullName" AS "receiverName"`,
        // ])
        // .getRawMany();

        // const debit: any = await this.splitRepository
        // .createQueryBuilder("s")
        // .leftJoinAndSelect(UserEntity, "u", 'u."userId" = s."fk_user_id"')
        // .leftJoinAndSelect(UserEntity,"uu",'uu."userId" = s."fk_reciver_id"')
        // .where('u."isArchived" = :isArchived', { isArchived: 1 })
        // .andWhere("s.fk_reciver_id = :userId", { userId: userId })
        // .select([
        //   `s."splitId" AS "splitId"`,
        //   `s."fk_user_id" AS "splitBy"`,
        //   `s."fk_reciver_id" AS "receivedBy"`,
        //   `s."splitAmount" AS "splitAmount"`,
        //   `s."updatedAt" AS "transactionDate"`,
        //   `u."fullName" AS "payerName"`,
        //   `uu."fullName" AS "receiverName"`,
        // ])
        // .getRawMany();

        const splits = await this.splitRepository
          .createQueryBuilder("s")
          .leftJoinAndSelect(UserEntity, "u", 'u."userId" = s."fk_user_id"')
          .leftJoinAndSelect(
            UserEntity,
            "uu",
            'uu."userId" = s."fk_reciver_id"'
          )
          .where('u."isArchived" = :isArchived', { isArchived: 1 })
          .andWhere("s.fk_user_id = :userId", { userId: userId })
          .groupBy('s."fk_reciver_id"')
          .addGroupBy('s."fk_user_id"')
          .addGroupBy('u."fullName"')
          .addGroupBy('uu."fullName"')
          .select([
            's."fk_user_id" AS "splitBy"',
            's."fk_reciver_id" AS "receivedBy"',
            'SUM(s."splitAmount") AS "levana"',
            'u."fullName" AS "spliterName"',
            'uu."fullName" AS "receiverName"',
          ])
          .getRawMany();
        console.log("\n-----------------splits", splits);

        if (splits && splits.length > 0) {
          for (let i in splits) {
            const settle = await this;
          }
        }

        const debitSum: any = await this.splitRepository
          .createQueryBuilder("s")
          .leftJoinAndSelect(UserEntity, "u", 'u."userId" = s."fk_user_id"')
          .leftJoinAndSelect(
            UserEntity,
            "uu",
            'uu."userId" = s."fk_reciver_id"'
          )
          .where('u."isArchived" = :isArchived', { isArchived: 1 })
          .andWhere("s.fk_reciver_id = :userId", { userId: userId })
          .groupBy('s."fk_user_id"')
          .addGroupBy('s."fk_reciver_id"')
          .addGroupBy('u."fullName"')
          .addGroupBy('uu."fullName"')
          .select([
            's."fk_user_id" AS "splitBy"',
            's."fk_reciver_id" AS "receivedBy"',
            'SUM(s."splitAmount") AS "devana"',
            'u."fullName" AS "spliterName"',
            'uu."fullName" AS "receiverName"',
          ])
          .getRawMany();

        console.log("\n-----------------debitsum", debitSum);

        return resolve({
          levana: getSplit,
          debit: debitSplit,
          splits,
          debitSum,
        });
      } catch (error) {
        console.log(`\n get Split History service error ${error}`);
        reject(error);
      }
    });
  }

  async settleUp(body: any): Promise<any> { 
    return new Promise(async (resolve, reject) => {
      try {
        const { userId, splitId } = body;

        const isUserExists = await this.userRepository.findOne({
          where: { userId: userId, isArchived: 1 },
        });
        if (!isUserExists) {
          throw new NotFoundException("USER_NOT");
        }

        const checkSettle = await this.splitRepository.findOne({
          where: { splitId: splitId, fk_reciver_id: userId, isSettle: 1 },
        });
        console.log("----------------------------------check",checkSettle);
        if (!checkSettle) {
          throw new NotFoundException("SPLIT_IS_NOT");
        }

        const account = await this.accountRepository.findOne({
          where: { fk_user_id: userId },
        });

        const checkSplit = await this.accountRepository.findOne({
          where: { fk_user_id: checkSettle.fk_reciver_id },
        });

        if(!account && !checkSplit){
          throw new NotFoundException('USER_NOT')
        }

        const balance = account.balance >= checkSettle.splitAmount
        if(!balance){
          throw new NotFoundException('INSUFFICIENT_BALANCE')
        }

        if (balance) {
          const settleAmount = await this.splitRepository.save({
            splitId: splitId,
            splitAmount: 0,
            isSettle: 0,
          });
          // .createQueryBuilder()
          // .update()
          // .set({ splitAmount: 0, isSettle: 0 })
          // .where('splitId = :splitId',{ splitId : splitId })
          // .execute()
          // .getParameters()

          console.log("\n---------- settle amount ---->>>>>", settleAmount);

          const amt = account.balance - checkSettle.splitAmount;
          const updateAccount = await this.accountRepository.update(
            { fk_user_id: userId },
            { balance: amt }
          );

          // const usedAct = await this.accountRepository.findOne({
          //   where: { fk_user_id: settleAmount.splitId },
          // });
          // if (!usedAct) {
          //   throw new NotFoundException("USER_NOT");
          // }

          const bal = checkSplit.balance + checkSettle.splitAmount;
          const updateAct = await this.accountRepository.update(
            { fk_user_id: checkSettle.fk_user_id },
            { balance: bal }
          );
        }

        return resolve({});
      } catch (error) {
        console.log(`\n settle up service error ${error}`);
        reject(error);
      }
    });
  }
}
