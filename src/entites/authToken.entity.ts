import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'authToken' })
export class AuthTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  authTokenId: string;

  @Column({ nullable: true })
  fk_user_id: string;

  @Column({ type: 'character varying' })
  accessToken: string;

  @Column({ nullable: true, type: 'character varying' })
  refreshToken: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => UserEntity, (userEntity) => userEntity.authTokenEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_user_id' })
  userEntity: UserEntity[];
}
