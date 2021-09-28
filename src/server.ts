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

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info(`Server listing on port: ${this.port}`);
    });
  }

  public async close(): Promise<void> {}
}
