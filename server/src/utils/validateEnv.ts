import { cleanEnv, port, str } from 'envalid';

export default () => {
  cleanEnv(process.env, {
    PORT: port(),
    NODE_ENV: str(),
    DATABASE_URL: str(),
    JWT_SECRET: str(),
    FRONTEND_URL: str()
  });
};
