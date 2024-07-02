import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'settleUp' })
export class SettleUpEntity {
  @PrimaryGeneratedColumn('uuid')
  settleUpId: string;

  @Column()
  fk_user_id: string;

  @Column({ default: 0, type: 'real', nullable: true })
  oweBy: number;

  @Column()
  fk_reciver_id: string;

  @Column({ default: 0, type: 'real', nullable: true })
  dueBy: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP',})
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP',})
  updatedAt: Date;

  
  @ManyToOne(() => UserEntity, (userEntity) => userEntity.settleUpEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_id' })
  userEntity: UserEntity[];


  @ManyToOne(() => UserEntity, (userEntity) => userEntity.reciverSettleUpEntity, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "fk_reciver_id" })
  reciverEntity: UserEntity[];

}
