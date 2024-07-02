import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'account' })
export class AccountEntity {
  @PrimaryGeneratedColumn('uuid')
  accountId: string;

  @Column()
  fk_user_id: string;

  @Column({ default: 0, type: 'integer' })
  amount: number;

  @Column({ default: 1, comment: `1 : User not deleted, 0 : User deleted` })
  isArchived: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.accountEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_id' })
  userEntity: UserEntity[];
  
}
