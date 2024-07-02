import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entites/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProfileSetupService {

    constructor(@InjectRepository(UserEntity) private pageRepository: Repository<UserEntity>) { }


    async login(body: any): Promise<void> {

        return new Promise(async (resolve, reject) => {
            try {



            } catch (error) {

                console.log(`Add page servioce error ${error}`);
                reject(error)

            }

        })

    }

}   