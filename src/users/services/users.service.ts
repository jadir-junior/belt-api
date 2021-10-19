import { CRUD } from '@src/common/interfaces/crud.interface';
import { CreateUserDto } from '../dto/create.user.dto';
import usersDao from '../dao/users.dao';

class UsersService implements CRUD {
    async create(resource: CreateUserDto) {
        return usersDao.addUser(resource);
    }

    async readById(_id: string) {
        return usersDao.getUserById(_id);
    }

    async getUserByEmailWithPassword(email: string) {
        return usersDao.getUserByEmailWithPassword(email);
    }
}

export default new UsersService();
