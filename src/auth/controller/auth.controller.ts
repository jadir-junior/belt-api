import { Request, Response } from 'express';

import config from 'config';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const jwtSecret: string = config.get('App.secret');
const tokenExperirationInSeconds = 36000;

class AuthController {
    async createJWT(req: Request, res: Response) {
        try {
            const refreshId = req.body._id + jwtSecret;
            const salt = crypto.createSecretKey(crypto.randomBytes(16));
            const hash = crypto
                .createHmac('sha512', salt)
                .update(refreshId)
                .digest('base64');
            req.body.refreshKey = salt.export();
            const token = jwt.sign(req.body, jwtSecret, {
                expiresIn: tokenExperirationInSeconds,
            });
            return res
                .status(201)
                .send({ accessToken: token, refreshToken: hash });
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    }
}

export default new AuthController();
