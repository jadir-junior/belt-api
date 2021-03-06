import * as database from './database';
import * as http from 'http';

import express, { Application } from 'express';

import { AuthRoutes } from './auth/auth.routes.config';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import cloudinary from 'cloudinary';
import config from 'config';
import cors from 'cors';
import dotenv from 'dotenv';
import expressPino from 'express-pino-logger';
import logger from './logger';
import swaggerDocs from './swagger.json';
import swaggerUi from 'swagger-ui-express';

dotenv.config();
export class SetupServer {
    private server?: http.Server;
    private app: Application = express();
    private routes: Array<CommonRoutesConfig> = [];

    constructor(private port = 3000) {}

    public async init(): Promise<void> {
        this.setupExpress();
        this.setupRoutes();
        this.setupCloudinary();
        await this.setupSwagger();
        await this.databaseSetup();
    }

    private setupExpress(): void {
        this.app.use(express.json());
        this.app.use(
            expressPino({
                logger,
            })
        );
        this.app.use(
            cors({
                origin: '*',
            })
        );
    }

    private async setupSwagger(): Promise<void> {
        await this.app.use(
            '/api-docs',
            swaggerUi.serve,
            swaggerUi.setup(swaggerDocs)
        );
    }

    private async databaseSetup(): Promise<void> {
        await database.connect();
    }

    private setupRoutes(): void {
        this.routes.push(new UsersRoutes(this.app));
        this.routes.push(new AuthRoutes(this.app));
    }

    private setupCloudinary(): void {
        cloudinary.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    public getApp(): Application {
        return this.app;
    }

    public start(): void {
        this.server = this.app.listen(this.port, () => {
            logger.info(`Server listing on port: ${this.port}`);
        });
    }

    public async close(): Promise<void> {
        await database.close();
        if (this.server) {
            await new Promise((resolve, reject) => {
                this.server?.close((error) => {
                    if (error) {
                        return reject(error);
                    }

                    resolve(true);
                });
            });
        }
    }
}
