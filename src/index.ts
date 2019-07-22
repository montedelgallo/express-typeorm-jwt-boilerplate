/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import routes from './routes';

//Connects to the Database -> then starts the express
createConnection()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .then(async connection => {
    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use('/', routes);

    return app.listen(3000, () => {
      console.log('Server started on port 3000!');
    });
  })
  .catch(error => console.log(error));
