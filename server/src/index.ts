// MUST be first
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes';
import itemRoutes from './routes/itemRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.get('/', (_req, res) => {
  res.send('Inventory API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
