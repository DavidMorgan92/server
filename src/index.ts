import * as dotenv from 'dotenv';
import app from './server';

// Configure environment variables
dotenv.config();

// Start server
const port = Number(process.env.PORT);
app.listen(port, () => console.log(`Server listening on port ${port}`));
