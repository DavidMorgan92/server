import * as dotenv from 'dotenv';
import app from './server';

// Configure environment variables
dotenv.config();

// Throw if port number isn't configured
if (process.env.PORT === undefined)
	throw new Error('Configure PORT environment variable');

// Start server
const port = Number(process.env.PORT);
app.listen(port, () => console.log(`Server listening on port ${port}`));
