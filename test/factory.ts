process.env.NODE_ENV = 'test';

// Set env variables from .env file
import { config } from 'dotenv';
config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createConnection, ConnectionOptions, Connection, getRepository } from 'typeorm';
import { createServer, Server as HttpServer } from 'http';

import * as express from 'express';
import * as supertest from 'supertest';

import myapp from '../src/app';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

/**
 * TestFactory
 * - Loaded in each unit test
 * - Starts server and DB connection
 */

export class TestFactory {
  private _app: express.Application;
  private _connection: Connection;
  private _server: HttpServer;

  // DB connection options
  private options: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME_TEST,
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
    entities: ['src/entity/**/*.ts', 'entity/**/*.js'],
    migrations: ['src/migration/**/*.ts', 'migration/**/*.js'],
    subscribers: ['src/subscriber/**/*.ts', 'migration/**/*.js'],
    namingStrategy: new SnakeNamingStrategy(),
  };

  public get app(): supertest.SuperTest<supertest.Test> {
    return supertest(this._app);
  }

  public get connection(): Connection {
    return this._connection;
  }

  public get server(): HttpServer {
    return this._server;
  }

  public async init(): Promise<void> {
    // logger.info('Running startup for test case');
    await this.startup();
  }

  /**
   * Close server and DB connection
   */
  public async close(): Promise<void> {
    this._server.close();
    // remove all the datas from db
    this._connection.close();
  }

  /**
   * Connect to DB and start server
   */
  private async startup(): Promise<void> {
    this._connection = await createConnection(this.options);
    this._app = myapp;
    this._server = createServer(this._app).listen(3000);
  }
}
