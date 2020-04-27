/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
require('dotenv').config();
import { createServer, Server as HttpServer } from 'http';
import * as express from 'express';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import expressApp from './app';

export default (async function main(expressApp) {
  try {
    console.log('Initializing ORM connection...');
    const connection: Connection = await createConnection({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
      entities: ['src/entity/**/*.ts', 'entity/**/*.js'],
      migrations: ['src/migration/**/*.ts', 'migration/**/*.js'],
      subscribers: ['src/subscriber/**/*.ts', 'migration/**/*.js'],
      cli: {
        entitiesDir: 'src/entity',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
      },
      namingStrategy: new SnakeNamingStrategy(),
    });

    // Init express server
    const app: express.Application = expressApp;
    const server: HttpServer = createServer(app);

    // Start express server
    server.listen(3000);

    server.on('listening', () => {
      console.log('starting server!');
    });

    server.on('close', () => {
      connection.close();
      console.log('aionic-core node server closed');
    });
  } catch (err) {
    console.log(err.stack);
  }
})(expressApp);
