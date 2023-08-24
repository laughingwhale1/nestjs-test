import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {User} from "./users.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {RolesService} from "../roles/roles.service";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User)
                private userRepository: typeof User,
                private rolesService: RolesService
    ) {
    }

    async createUser (dto: CreateUserDto) {
        const user =  await this.userRepository.create(dto);
        const role = await this.rolesService.getRoleByValue('USER');
        await user.$set('roles', [role.id])
        user.roles = [role]
        return user;
    }

    async getUsers () {
        return await this.userRepository.findAll({include: {all: true}});
    }

    async getUserByEmail (email: string) {
        // return await this.userRepository.destroy({where: {email}})
        return await this.userRepository.findOne({where: {email}, include: {all: true}})
    }
}
