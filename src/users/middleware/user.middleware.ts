import { NextFunction, Request, Response } from 'express';

import usersService from '../services/users.service';

class UsersMiddleware {
    async validateSameEmailBelongToSameUser(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        const user = await usersService.getUserByEmail(req.body.email);
        if (user && user._id === res.locals.jwt._id) {
            res.locals.user = user;
            next();
        } else {
            res.status(400).send({ errors: 'Invalid email' });
        }
    }

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

    validatePatchEmail = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (req.body.email) {
            this.validateSameEmailBelongToSameUser(req, res, next);
        } else {
            next();
        }
    };
}

export default new UsersMiddleware();
