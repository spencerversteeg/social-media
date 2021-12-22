// Import environment variables
import 'dotenv/config';

// Package imports
import express, { Application } from 'express';

// Project imports
import router from './routes';
import validateEnv from './utils/validateEnv';

// Validate environment variables
validateEnv();

// Create app
const app: Application = express();

// Initialize middleware
app.use(express.json());

app.use('/api', router);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
