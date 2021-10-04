import { CRUD } from '@src/common/interfaces/crud.interface';
import { CreateUserDto } from '../dto/create.user.dto';
import usersDao from '../dao/users.dao';

class UsersService implements CRUD {
    async create(resource: CreateUserDto) {
        return usersDao.addUser(resource);
    }
}

export default new UsersService();
