import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { DeviceRelationEntity } from "./deviceRelation.entity";
import { AuthTokenEntity } from "./authToken.entity";
import { AccountEntity } from "./account.entity";
import { PaymentEntity } from "./payment.entity";
import { SplitEntity } from "./split.entity";

@Entity({ name: "user" })
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @Column({ type: "character varying", nullable: true })
  fullName: string;

  @Column({ type: "character varying", nullable: true })
  email: string;

  @Column({ type: 'bigint',nullable:true })
  mobileNumber: number;

  @Column({ nullable: true, type: "integer" })
  otp: number;

  @Column({ default: 1, comment: `1 : User not deleted, 0 : User deleted` })
  isArchived: number;

  @Column({
    default: 1,
    comment: `1 : is login, 0 : logout`,
  })
  isActive: number;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @OneToMany(
    () => DeviceRelationEntity,
    (deviceRelationEntity) => deviceRelationEntity.userEntity
  )
  deviceRelationEntity: DeviceRelationEntity[];

  @OneToMany(
    () => AuthTokenEntity,
    (authTokenEntity) => authTokenEntity.userEntity
  )
  authTokenEntity: AuthTokenEntity[];

  @OneToMany(() => AccountEntity, (accountEntity) => accountEntity.userEntity)
  accountEntity: AccountEntity[];

  @OneToMany(() => PaymentEntity, (paymentEntity) => paymentEntity.userEntity)
  paymentEntity: PaymentEntity[];

  @OneToMany(
    () => PaymentEntity,
    (paymentEntity) => paymentEntity.reciverEntity
  )
  reciverEntity: PaymentEntity[];

  @OneToMany(() => SplitEntity, (splitEntity) => splitEntity.userEntity)
  splitEntity: SplitEntity[];

  @OneToMany(() => SplitEntity, (splitEntity) => splitEntity.reciverEntity)
  reciverSplitEntity: SplitEntity[];
}
