import express from 'express';
import cors from 'cors';
import os from 'os';
import restaurantRoutes from './routes/restaurants';
import loginRoutes from './routes/login';
import signupRoutes from './routes/signup';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(cors());
app.use(express.json());

app.use('/login', loginRoutes);
app.use('/signup', signupRoutes);
app.use('/restaurants', restaurantRoutes);

app.get('/', (_req, res) => {
  res.send('🚀 Express + TypeScript + Prisma + SQLite');
});

app.listen(PORT, '0.0.0.0', () => {
  const networkInterfaces = os.networkInterfaces();
  const addresses: string[] = [];

  for (const iface of Object.values(networkInterfaces)) {
    if (!iface) continue;
    for (const { address, family, internal } of iface) {
      if (family === 'IPv4' && !internal) {
        addresses.push(address);
      }
    }
  }

  // ANSI colors
  const green = '\x1b[32m';
  const cyan = '\x1b[36m';
  const reset = '\x1b[0m';

  console.log(`${green}✅ Server running on:${reset}`);
  console.log(`${cyan}   - http://localhost:${PORT}${reset}`);
  for (const addr of addresses) {
    console.log(`${cyan}   - http://${addr}:${PORT}${reset}`);
  }
});