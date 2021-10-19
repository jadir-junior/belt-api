import { NextFunction, Request, Response } from 'express';

import argon2 from 'argon2';
import usersService from '../../users/services/users.service';

class AuthMiddleware {
    async verifyUserPassword(req: Request, res: Response, next: NextFunction) {
        const user = await usersService.getUserByEmailWithPassword(
            req.body.email
        );
        if (user) {
            const passwordHash = user.password;
            if (await argon2.verify(passwordHash, req.body.password)) {
                req.body = {
                    _id: user._id,
                    email: user.email,
                    permissionFlags: user.permissionFlags,
                    name: user?.name,
                    position: user?.position,
                };
                return next();
            } else {
                res.status(400).send({
                    errors: [
                        {
                            msg: 'Invalid password',
                            param: 'password',
                            location: 'verify user password',
                        },
                    ],
                });
            }
        } else {
            res.status(400).send({
                errors: [
                    {
                        msg: 'Invalid email',
                        param: 'email',
                        location: 'verify user email',
                    },
                ],
            });
        }
    }
}

export default new AuthMiddleware();
