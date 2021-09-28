import * as database from './database';
import * as http from 'http';

import express, { Application } from 'express';

import cors from 'cors';
import expressPino from 'express-pino-logger';
import logger from './logger';

export class SetupServer {
  private server?: http.Server;
  private app: Application = express();

  constructor(private port = 3000) {}

  public async init(): Promise<void> {
    this.setupExpress();
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

  private async databaseSetup(): Promise<void> {
    await database.connect();
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
