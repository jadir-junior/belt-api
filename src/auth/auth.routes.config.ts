import { Application } from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import authController from './controller/auth.controller';
import authMiddleware from './middleware/auth.middleware';
import { body } from 'express-validator';
import bodyValidationMiddleware from '../common/middleware/body.validation.middleware';
import jwtMiddleware from './middleware/jwt.middleware';
import permissionValidationMiddleware from '../common/middleware/permission.validation.middleware';
import tokenValidationMiddleware from '../common/middleware/token.validation.middleware';
import userMiddleware from '../users/middleware/user.middleware';
import usersController from '../users/controller/users.controller';

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

        this.app
            .route('/auth/me')
            .all(
                tokenValidationMiddleware.decodedTokenAndGetId,
                userMiddleware.valideUserExists,
                jwtMiddleware.validJwtNeeded,
                permissionValidationMiddleware.onlySameUserOrAdminCanDoThisActions
            )
            .get(usersController.getUserById);

        return this.app;
    }
}
