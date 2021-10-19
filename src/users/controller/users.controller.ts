import { Request, Response } from 'express';

import argon2 from 'argon2';
import usersService from '../services/users.service';

class UsersController {
    async createUser(req: Request, res: Response) {
        req.body.password = await argon2.hash(req.body.password);
        const user = await usersService.create(req.body);
        res.status(201).send(user);
    }

    async getUserById(req: Request, res: Response) {
        if (res.locals.user && res.locals.user._id) {
            const user = await usersService.readById(res.locals.user._id);
            res.status(200).send(user);
        } else {
            const user = await usersService.readById(req.params._id);
            res.status(200).send(user);
        }
    }

    async patch(req: Request, res: Response) {
        if (req.body.password) {
            req.body.password = await argon2.hash(req.body.password);
        }
        const user = await usersService.patchById(req.params.userId, req.body);
        res.status(200).send(user);
    }
}

export default new UsersController();
