import { Router } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();

/**
 * GET /restaurants → lista todos (incluye lat/long)
 */
router.get('/', async (_req, res) => {
  
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching user list' });
  }
});


// POST /login → log user in
router.post('/', async (req, res) => {
  
  const { identifier, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { name: identifier },
          { email: identifier },
        ],
      },
    })

    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if ( !validPassword ) {
      return res.status(400).json({ error: 'Incorrect password for this user.'})
    } 

    res.status(201).json({
      "accessToken": "<JWT corto (p.e. 5-15 min)>",
      "refreshToken": "<refresh token (largo, revocable)>",
      "expiresIn": 900,         // segundos (opcional)
      "user": { "id": 123, "username": "juan" }
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error trying to log in', details: err });
  }
});


export default router;
