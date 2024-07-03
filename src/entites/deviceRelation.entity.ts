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

  @Column({ type: 'int', nullable: true })
  deviceType: number;

  @Column({ type: 'character varying', nullable: true })
  deviceId: string;

  @Column({ type: 'character varying', nullable: true })
  deviceToken: string;

  @Column({ type: 'character varying', nullable: true })
  appVersion: string;

  @Column({ type: 'character varying', nullable: true })
  os: string;

  @Column({ type: 'character varying', comment: `en for English`, nullable: true })
  language: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP',})
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP',})
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
