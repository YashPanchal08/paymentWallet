import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'deviceRelation' })
export class DeviceRelationEntity {
  @PrimaryGeneratedColumn('uuid')
  deviceRelationId: string;

  @Column()
  fk_user_id: string;

  @Column({ type: 'int' })
  deviceType: number;

  @Column({ type: 'character varying' })
  deviceId: string;

  @Column({ type: 'character varying' })
  deviceToken: string;

  @Column({ type: 'character varying' })
  appVersion: string;

  @Column({ type: 'character varying' })
  os: string;

  @Column({ type: 'character varying', comment: `en for English` })
  language: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(
    () => UserEntity,
    (userEntity) => userEntity.deviceRelationEntity,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'fk_user_id' })
  userEntity: UserEntity[];
}
