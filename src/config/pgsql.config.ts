import { join } from "path";
import 'dotenv/config'

export const database: any = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // entites:[UserEntity,AuthTokenEntity,DeviceRelationEntity,PaymentEntity,SplitEntity,AccountEntity],
  entities: [join(__dirname, "../entities/**/*.entity{.ts,.js}")],
  synchronize: false,
  logging: true
}
