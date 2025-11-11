import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

/**
 * GET /restaurants → lista todos (incluye lat/long)
 */
router.get('/', async (_req, res) => {
  
});


export default router;