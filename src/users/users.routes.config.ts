import { Application } from 'express';
import { CommonRoutesConfig } from '../common/common.routes.config';
import usersController from './controller/users.controller';

export class UsersRoutes extends CommonRoutesConfig {
    constructor(app: Application) {
        super(app, 'UsersRoutes');
    }

    configureRoutes(): Application {
        this.app.route('/users').post(usersController.createUser);

        return this.app;
    }
}
