import { Application } from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import authController from './controller/auth.controller';
import authMiddleware from './middleware/auth.middleware';
import { body } from 'express-validator';
import bodyValidationMiddleware from '../common/middleware/body.validation.middleware';

export class AuthRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'AuthRoutes');
    }

    configureRoutes(): Application {
        this.app.post('/login', [
            body('email').isEmail(),
            body('password').isString(),
            bodyValidationMiddleware.verifyBodyFieldsErrors,
            authMiddleware.verifyUserPassword,
            authController.createJWT,
        ]);

        return this.app;
    }
}
