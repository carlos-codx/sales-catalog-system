import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './utils/database';
import { runMigrationsAndSeeders } from './utils/migrator';

dotenv.config();
const app = express();
app.use(express.json());

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');

    await runMigrationsAndSeeders(sequelize);

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
};

startServer();