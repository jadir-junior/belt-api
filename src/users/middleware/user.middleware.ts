import { NextFunction, Request, Response } from 'express';

import usersService from '../services/users.service';

class UsersMiddleware {
    async valideUserExists(req: Request, res: Response, next: NextFunction) {
        const user = await usersService.readById(req.params.userId);
        if (user) {
            res.locals.user = user;
            next();
        } else {
            res.status(404).send({
                errors: [`User ${req.params.userId} not found`],
            });
        }
    }
}

export default new UsersMiddleware();
