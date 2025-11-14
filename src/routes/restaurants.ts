import { Router } from 'express';
import prisma from '../prisma';
import { AuthRequest, requireAuth } from '../middleware/auth';

const router = Router();

/**
 * GET /restaurants → lista todos (incluye lat/long)
 */
router.get('/', async (_req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      select: {
        id_restaurant: true,
        restaurant_name: true,
        description: true,
        menu_link: true,
        location: true,      // si lo seguís usando como string
        latitude: true,
        longitude: true,
      },
    });
    res.json(restaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching restaurants' });
  }
});

/**
 * POST /restaurants → crea uno (ahora acepta latitude/longitude)
 * body: { restaurant_name, description, menu_link, location?, latitude?, longitude? }
 */
router.post('/', requireAuth, async (req: AuthRequest, res) => {
  try {
    const {
      restaurant_name,
      description,
      menu_link,
      location,           // opcional si lo querés mantener
      latitude,
      longitude,
    } = req.body;

    if ( !req.id_user ) return res.status(401).json({ error: 'Unauthorized' });

    // Validaciones básicas
    if (!restaurant_name || typeof restaurant_name !== 'string') {
      return res.status(400).json({ error: 'restaurant_name is required' });
    }
    if (menu_link && typeof menu_link !== 'string') {
      return res.status(400).json({ error: 'menu_link must be a string' });
    }
    if (description && typeof description !== 'string') {
      return res.status(400).json({ error: 'description must be a string' });
    }
    if (location && typeof location !== 'string') {
      return res.status(400).json({ error: 'location must be a string' });
    }
    if ( latitude == null || longitude == null ) {
      return res.status(400).json({ error: 'latitude/longitude must be defined' });
    }

    // Parse and validate as numbers
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      return res.status(400).json({ error: 'latitude must be a number in [-90, 90]' });
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      return res.status(400).json({ error: 'longitude must be a number in [-180, 180]' });
    }

    const newRestaurant = await prisma.restaurant.create({
      data: {
        restaurant_name,
        description: description ?? null,
        menu_link: menu_link ?? null,
        location: location ?? null,   // mantené este campo si lo usás
        latitude: lat,
        longitude: lng,
      },
      select: {
        id_restaurant: true,
        restaurant_name: true,
        description: true,
        menu_link: true,
        location: true,
        latitude: true,
        longitude: true,
      },
    });

    res.status(201).json(newRestaurant);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error creating restaurant', details: (err as Error).message });
  }
});

// Remove entries
router.post('/delete', requireAuth, async (req: AuthRequest, res) => {
  try {
    const {
      id_restaurant,
    } = req.body;

    if ( !req.id_user || req.id_user !== 4 ) return res.status(401).json({ error: 'Unauthorized' });

    const deleted = await prisma.restaurant.delete({
      where: { id_restaurant: id_restaurant },
    });

    res.status(201).json(deleted);
    
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error deleting restaurant', details: (err as Error).message });
  }
});

/**
 * (OPCIONAL) GET /restaurants/near?lat=-34.47&lng=-58.51&radius=2000
 * Bounding box rápido + podés afinar con Haversine del lado del server si querés
 */
router.get('/near', async (req, res) => {
  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radius = Number(req.query.radius ?? 2000); // metros

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: 'lat and lng are required numbers' });
  }

  // bounding box aproximado (rápido)
  const dLat = radius / 111_320; // ~ metros por grado lat
  const dLng = radius / (111_320 * Math.cos((lat * Math.PI) / 180));

  const minLat = lat - dLat;
  const maxLat = lat + dLat;
  const minLng = lng - dLng;
  const maxLng = lng + dLng;

  try {
    const candidates = await prisma.restaurant.findMany({
      where: {
        latitude: { gte: minLat, lte: maxLat },
        longitude: { gte: minLng, lte: maxLng },
      },
      select: {
        id_restaurant: true,
        restaurant_name: true,
        description: true,
        menu_link: true,
        latitude: true,
        longitude: true,
      },
    });

    // (Opcional) ordenar por distancia exacta con Haversine:
    // si querés, te paso la función y lo sumamos acá.

    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching nearby restaurants' });
  }
});

export default router;
