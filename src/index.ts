import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './utils/database';
import { runMigrationsAndSeeders } from './utils/migrator';
import productRoutes from './routes/product.routes';
import clientRoutes from './routes/client.routes';
import discountRoutes from './routes/discount.routes';
import salesRoutes from './routes/sale.routes';


dotenv.config();
const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/discounts', discountRoutes);
app.use('/api/sales', salesRoutes);

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