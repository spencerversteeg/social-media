// Import environment variables
import 'dotenv/config';

// Package imports
import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';

const corsWhitelist = [`${process.env.FRONTEND_URL}`, 'http://localhost:8080'];

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      // if theyre hitting from none browser
      !origin ||
      corsWhitelist.indexOf(origin) !== -1
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Project imports
import router from './routes';
import validateEnv from './utils/validateEnv';

// Validate environment variables
validateEnv();

// Create app
const app: Application = express();

// Initialize middleware
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', router);

// Start server
app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
