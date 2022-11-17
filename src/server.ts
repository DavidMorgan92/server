import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import errorHandler from './util/error-handler';
import configurePassport from './util/configure-passport';
import { initGlobalRateLimiter } from './util/rate-limiter';
import auth from './routes/auth';

// Create Express app
const app = express();

// Use Helmet
app.use(helmet());

// Use Morgan logger (disable if running tests)
/* istanbul ignore if */
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Configure CORS
app.use(cors({ origin: process.env.CLIENT_ORIGIN }));

// Use JSON body parser
app.use(express.json());

// Configure passport
configurePassport(passport);

// Use Passport
app.use(passport.initialize());

// Use global rate limiter
initGlobalRateLimiter(app);

// Connect routers
app.use('/auth', auth);

// Use custom error handler
app.use(errorHandler);

export default app;
