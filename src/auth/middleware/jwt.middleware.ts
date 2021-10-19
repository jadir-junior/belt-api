import { NextFunction, Request, Response } from 'express';

import { Jwt } from '@src/common/types/jwt.type';
import config from 'config';
import jwt from 'jsonwebtoken';

const jwtSecret: string = config.get('App.secret');

class JwtMiddleware {
    validJwtNeeded(req: Request, res: Response, next: NextFunction) {
        if (req.headers['authorization']) {
            try {
                const authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send();
                } else {
                    res.locals.jwt = jwt.verify(
                        authorization[1],
                        jwtSecret
                    ) as Jwt;
                    next();
                }
            } catch (error) {
                return res.status(403).send();
            }
        } else {
            return res.status(401).send();
        }
    }
}

export default new JwtMiddleware();
