import { Request, Response } from 'express';

import argon2 from 'argon2';
import usersService from '../services/users.service';

class UsersController {
    async createUser(req: Request, res: Response) {
        req.body.password = await argon2.hash(req.body.password);
        const user = await usersService.create(req.body);
        res.status(201).send(user);
    }
}

export default new UsersController();
