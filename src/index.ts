import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from './lib/auth';

import userRoutes from './routes/user.routes';
import categoryRoutes from './routes/category.routes';
import productRoutes from './routes/product.routes';
import reviewRoutes from './routes/review.routes';
import orderRoutes from './routes/order.routes';

import { globalErrorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth/*path', toNodeHandler(auth));

app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    data: {
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth/*',
        users: '/api/users',
        categories: '/api/categories',
        products: '/api/products',
        reviews: '/api/reviews',
        orders: '/api/orders',
      },
    },
  });
});

app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
