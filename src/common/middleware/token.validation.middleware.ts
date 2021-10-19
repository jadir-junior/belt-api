import { NextFunction, Request, Response } from 'express';

import jwtDecode from 'jwt-decode';

class TokenValidationMiddeware {
    async decodedTokenAndGetId(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        if (req.headers['authorization']) {
            try {
                const authorization = req.headers['authorization'].split(' ');
                if (authorization[0] !== 'Bearer') {
                    return res
                        .status(401)
                        .send({ error: 'Token is not a Bearer' });
                } else {
                    const decoded: any = jwtDecode(authorization[1]);
                    req.params.userId = decoded._id;
                    return next();
                }
            } catch (error) {
                return res.status(403).send();
            }
        } else {
            return res
                .status(401)
                .send({ error: 'Authorization header empty' });
        }
    }
}

export default new TokenValidationMiddeware();
