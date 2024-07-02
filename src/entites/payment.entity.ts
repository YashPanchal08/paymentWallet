import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({ name: "payment" })
export class PaymentEntity {
  @PrimaryGeneratedColumn("uuid")
  paymentId: string;

  @Column()
  fk_user_id: string;

  @Column({ default: 0, type: "integer" })
  amount: number;

  @Column()
  fk_reciver_id: string;

  @Column({ default: 1, comment: `1 : User not deleted, 0 : User deleted` })
  isArchived: number;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.paymentEntity, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "fk_user_id" })
  userEntity: UserEntity[];

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.reciverEntity, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "fk_reciver_id" })
  reciverEntity: UserEntity[];
}
