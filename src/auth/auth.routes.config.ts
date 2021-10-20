import { Application } from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import UploadFileService from '../common/services/upload.file.service';
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
                permissionValidationMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(usersController.getUserById);

        this.app.patch('/auth/me/:userId', [
            jwtMiddleware.validJwtNeeded,
            body('email').isEmail().optional(),
            body('password')
                .isLength({ min: 5 })
                .withMessage('Password must be 5 characters')
                .optional(),
            body('name').isString().optional(),
            body('position').isString().optional(),
            // see the permissionFlags work
            body('permissionFlags').isInt().optional(),
            bodyValidationMiddleware.verifyBodyFieldsErrors,
            userMiddleware.validatePatchEmail,
            permissionValidationMiddleware.onlySameUserOrAdminCanDoThisAction,
            usersController.patch,
        ]);

        this.app.post(
            '/auth/me/photo/:userId',
            jwtMiddleware.validJwtNeeded,
            permissionValidationMiddleware.onlySameUserOrAdminCanDoThisAction,
            UploadFileService.upload.single('file'),
            usersController.uploadProfilePhoto
        );

        return this.app;
    }
}
