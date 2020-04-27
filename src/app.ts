require('dotenv').config();
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
// import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import routes from './routes';

const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

//Set all routes from routes folder
app.use('/api/', routes);

export default app;
