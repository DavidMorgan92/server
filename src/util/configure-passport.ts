import { PassportStatic } from 'passport';
import {
	ExtractJwt,
	Strategy as JwtStrategy,
	StrategyOptions as JwtStrategyOptions,
} from 'passport-jwt';
import path from 'path';
import fs from 'fs';
import { verifyJwt } from '../services/auth-service';

// Throw if public PEM key filename isn't configured
/* istanbul ignore if */
if (process.env.JWT_PUBLIC_KEY_FILENAME === undefined)
	throw new Error('Configure JWT_PUBLIC_KEY_FILENAME environment variable');

/** Path to public key PEM file */
const pathToKey = path.join(process.cwd(), process.env.JWT_PUBLIC_KEY_FILENAME);

/** Public key to verify JWT */
const publicKey = fs.readFileSync(pathToKey, 'utf-8');

/** Configuration options for JWT verification */
const jwtOptions: JwtStrategyOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	algorithms: ['RS256'],
	secretOrKey: publicKey,
};

/**
 * Configure the passport strategy for authentication
 * @param passport Passport instance
 */
export default function configurePassport(passport: PassportStatic): void {
	passport.use(new JwtStrategy(jwtOptions, verifyJwt));
}
