import { Router } from 'express';
import prisma from '../prisma';

const router = Router();

// GET /restaurants → list all
router.get('/', async (_req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany();
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching restaurants' });
  }
});

// POST /restaurants → create one
router.post('/', async (req, res) => {
  const { restaurant_name, description, menu_link, location } = req.body;
  try {
    const newRestaurant = await prisma.restaurant.create({
      data: { restaurant_name, description, menu_link, location },
    });
    res.status(201).json(newRestaurant);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error creating restaurant', details: err });
  }
});

export default router;
