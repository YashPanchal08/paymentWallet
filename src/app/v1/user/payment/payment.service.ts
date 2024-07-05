import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException, Search } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entites/user.entity";
import { Repository } from "typeorm";
import { Token } from "src/common/getJwtToken";
import { AccountEntity } from "src/entites/account.entity";
import { SplitEntity } from "src/entites/split.entity";
import { getAllHistoryDto } from "./dto/getAllHistory.dto";
import { PaymentEntity } from "src/entites/payment.entity";
import * as moment from "moment";
import { getAllHistoryByIdDto } from "./dto/getAllHistoryById.dto";
import { paymentDto } from "./dto/payment.dto";

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(AccountEntity) private accountRepository: Repository<AccountEntity>,
        @InjectRepository(SplitEntity) private splitRepository: Repository<SplitEntity>,
        @InjectRepository(PaymentEntity) private paymentRepository: Repository<PaymentEntity>,
        private token: Token
    ) { }

    async getAllHistory(params: getAllHistoryDto): Promise<object> {
        return new Promise(async (resolve, reject) => {
            try {

                let { page, limit, userId, search } = params
                console.log(params);

                const isUserExits = await this.paymentRepository.find({
                    where: {
                        fk_user_id: userId,
                    }
                })

                if (!isUserExits) {
                    throw new NotFoundException("USER_NOT")
                }

                const payment = await this.paymentRepository.createQueryBuilder("payment")
                payment.leftJoin(UserEntity, 'sender', 'payment.fk_user_id = sender.userId')
                payment.leftJoin(UserEntity, 'receiver', 'payment.fk_reciver_id = receiver.userId')
                payment.select([
                    `payment."paymentId" AS "paymentId"`,
                    `payment.fk_user_id AS "senderId"`,
                    `sender."fullName" AS "senderName"`,
                    `payment.fk_reciver_id AS "receiverId"`,
                    `receiver."fullName" AS "reciverName"`,
                    `payment.amount AS "paidAmount"`,
                    `payment."createdAt" AS "paymentAt"`
                ])
                payment.where(`sender."isArchived" = :isArchived`, { isArchived: 1 })
                payment.andWhere(`payment.fk_user_id = :userId`, { userId: userId })
                payment.offset((page - 1) * limit)
                payment.limit(limit)

                if (search) {
                    payment.andWhere(`receiver."fullName" ILIKE (:search)`, { search: `%${search}%` })
                }




                const [allData, totalCount] = await Promise.all([
                    payment.getRawMany(),
                    payment.getCount()
                ])

                let dates = []
                console.log(allData);
                allData.forEach(element => {
                    if (element) {
                        const date = new Date(element.paymentAt)
                        const past = moment(date).format('MMMM D, YYYY')

                        dates.push(past.toString())
                    }

                    console.log(dates);
                    for (let i = 0; i < dates.length; i++) {
                        if (dates.length === 0) return false

                        if (allData) {
                            allData[i].paymentAt = dates[i]
                        }

                    }
                });

                return resolve({
                    allData,
                    currentPage: parseInt(page),
                    totalPayment: totalCount,
                    totalPage: Math.ceil(totalCount / limit)
                })

            } catch (error) {
                console.log(`getAllHistory user service error ${error}`);
                reject(error);
            }
        });
    }

    async getAllHistoryById(params: getAllHistoryByIdDto): Promise<object> {
        return new Promise(async (resolve, reject) => {
            try {

                let { userId, receiverId } = params
                console.log(params);

                const isUserExits = await this.paymentRepository.find({
                    where: {
                        fk_user_id: userId,
                        fk_reciver_id: receiverId,
                    }
                })

                if (!isUserExits) {
                    throw new NotFoundException("USER_NOT")
                }

                const payment = await this.paymentRepository.createQueryBuilder("payment")
                payment.leftJoin(UserEntity, 'sender', 'payment.fk_user_id = sender.userId')
                payment.leftJoin(UserEntity, 'receiver', 'payment.fk_reciver_id = receiver.userId')
                payment.select([
                    `payment."paymentId" AS "paymentId"`,
                    `payment.fk_user_id AS "senderId"`,
                    `sender."fullName" AS "senderName"`,
                    `payment.fk_reciver_id AS "receiverId"`,
                    `receiver."fullName" AS "reciverName"`,
                    `payment.amount AS "paidAmount"`,
                    `payment."createdAt" AS "paymentAt"`
                ])
                payment.where(`sender."isArchived" = :isArchived`, { isArchived: 1 })
                payment.andWhere(`payment.fk_user_id = :userId AND payment.fk_reciver_id = :receiverId`, { userId: userId, receiverId: receiverId })


                const [allData] = await Promise.all([
                    payment.getRawMany()
                ])

                let dates = []
                console.log(allData);
                allData.forEach(element => {
                    if (element) {
                        const date = new Date(element.paymentAt)
                        const past = moment(date).format('MMMM D, YYYY')

                        dates.push(past.toString())
                    }

                    console.log(dates);
                    for (let i = 0; i < dates.length; i++) {
                        if (dates.length === 0) return false

                        if (allData) {
                            allData[i].paymentAt = dates[i]
                        }

                    }
                });

                return resolve({
                    allData
                })

            } catch (error) {
                console.log(`getAllHistory user service error ${error}`);
                reject(error);
            }
        });
    }

    async payment(body: paymentDto): Promise<object> {
        return new Promise(async (resolve, reject) => {
            try {
                const { userId, receiverId, amount, splitIds } = body

                /* *********************************************** Payment ************************************************** */

                const isReciverExits = await this.userRepository.findOne({
                    where: {
                        userId: receiverId,
                        isArchived: 1
                    }
                })

                if (!isReciverExits) {
                    throw new NotFoundException("USER_NOT")
                }

                if (userId === receiverId) {
                    throw new NotAcceptableException("CANNOT_SEND_TOYOURSELF")
                }
                console.log(isReciverExits);

                const isSenderExists = await this.accountRepository.findOne({
                    where: {
                        fk_user_id: userId
                    }
                })

                const isReciverBalanceExists = await this.accountRepository.findOne({
                    where: {
                        fk_user_id: receiverId
                    }
                })

                if (!isSenderExists) {
                    throw new NotFoundException("USER_NOT")
                }

                if (isSenderExists.balance <= amount) {
                    throw new ForbiddenException("INSUFFIENCE_BALANCE")
                }

                if (isSenderExists) {

                    const isMoneyTransffred = await this.paymentRepository.save({
                        fk_user_id: userId,
                        amount: amount,
                        fk_reciver_id: receiverId
                    })

                    if (isMoneyTransffred) {

                        const finalAmount = isSenderExists.balance - amount;
                        console.log("Sender Balance----------->", isSenderExists.balance);
                        console.log("Final Amount---------------->", finalAmount);
                        const senderBalance = await this.accountRepository.save({
                            accountId: isSenderExists.accountId,
                            fk_user_id: userId,
                            balance: finalAmount
                        })

                        console.log("Reciver balance------->", isReciverBalanceExists.balance);
                        const addedBalance = (isReciverBalanceExists.balance + amount);
                        console.log(addedBalance);
                        await this.accountRepository.save({
                            accountId: isReciverBalanceExists.accountId,
                            fk_user_id: receiverId,
                            balance: addedBalance
                        })
                    }
                }

                /******************************************************** Split *********************************************/
                if (splitIds && splitIds.length > 0) {
                    const splitParseIds = JSON.parse(splitIds.replace(/'/g, '"'));
                    console.log(splitParseIds);

                    for (const id of splitParseIds) {
                        const isSplitUserPresent = await this.accountRepository.findOne({
                            where: {
                                fk_user_id: id
                            }
                        })

                        if (!isSplitUserPresent) {
                            throw new NotFoundException("USER_NOT")
                        }

                        // console.log("Split ids----------->", isSplitUserPresent);
                        console.log(splitParseIds.length);
                        const length = splitParseIds.length + 1
                        const finalSplitAmount = (amount / length)

                        console.log(finalSplitAmount);

                        await this.splitRepository.save({
                            fk_user_id: userId,
                            splitAmount: finalSplitAmount,
                            fk_reciver_id: id
                        })
                    }
                }

                return resolve({})

            } catch (error) {
                console.log(`getAllHistory user service error ${error}`);
                reject(error);
            }
        });
    }

    async getAllSplitHistory(params: getAllHistoryByIdDto): Promise<object> {
        return new Promise(async (resolve, reject) => {
            try {

                let { userId, receiverId } = params
                console.log(params);

                const isUserExits = await this.paymentRepository.find({
                    where: {
                        fk_user_id: userId
                    }
                })

                if (!isUserExits) {
                    throw new NotFoundException("USER_NOT")
                }

                const payment = await this.splitRepository.createQueryBuilder("split")
                payment.leftJoin(UserEntity, 'sender', 'split.fk_user_id = sender.userId')
                payment.leftJoin(UserEntity, 'receiver', 'split.fk_reciver_id = receiver.userId')
                payment.select([
                    `split.fk_user_id AS "senderId"`,
                    `sender."fullName" AS "senderName"`,
                    `split.fk_reciver_id AS "receiverId"`,
                    `receiver."fullName" AS "receiverName"`,
                    `SUM(split."splitAmount") AS "getsBack"`,
                    `CASE WHEN '${userId}' IN(select s.fk_reciver_id from split s where s.fk_reciver_id = '${userId}') THEN SUM(split."splitAmount") ELSE 0 END AS "oweBy"`,
                ])
                payment.where(`sender."isArchived" = :isArchived`, { isArchived: 1 })
                payment.andWhere(`split.fk_user_id = :userId`, { userId: userId })
                payment.groupBy(`split.fk_reciver_id`)
                payment.addGroupBy(`receiver."fullName"`)
                payment.addGroupBy(`sender."fullName"`)
                payment.addGroupBy(`split.fk_user_id`)

                const [allData] = await Promise.all([
                    payment.getRawMany()
                ])
                
                return resolve({
                    allData
                })

            } catch (error) {
                console.log(`getAllHistory user service error ${error}`);
                reject(error);
            }
        });
    }
}
