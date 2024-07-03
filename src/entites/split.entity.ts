import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'split' })
export class SplitEntity {
  @PrimaryGeneratedColumn('uuid')
  splitId: string;

  @Column()
  fk_user_id: string;

  @Column({ default: 0, type: 'integer', nullable: true })
  splitAmount: number;

  @Column()
  fk_reciver_id: string;

  @Column({ default: 1, comment: `1 : User not deleted, 0 : User deleted`, nullable: true })
  isArchived: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP', nullable: true })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.splitEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_id' })
  userEntity: UserEntity[];


  @ManyToOne(() => UserEntity, (userEntity) => userEntity.reciverSplitEntity, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "fk_reciver_id" })
  reciverEntity: UserEntity[];

}
