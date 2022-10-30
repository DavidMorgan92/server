import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import errorHandler from './util/error-handler';
import auth from './routes/auth';

// Configure environment variables
dotenv.config();

// Create Express app
const app = express();

// Use Helmet
app.use(helmet());

// Use Morgan logger (disable if running tests)
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Configure CORS
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));

// Use JSON body parser
app.use(express.json());

// Connect routers
app.use('/auth', auth);

// Use custom error handler
app.use(errorHandler);

// Start server
const port = Number(process.env.PORT);
app.listen(port, () => console.log(`Server listening on port ${port}`));
