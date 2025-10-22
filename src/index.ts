import express from 'express';
import cors from 'cors';
import restaurantRoutes from './routes/restaurants';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

app.use('/restaurants', restaurantRoutes);

app.get('/', (_req, res) => {
  res.send('🚀 Express + TypeScript + Prisma + SQLite');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
