import { Router } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET env var');
}

const JWT_EXPIRES = (process.env.JWT_EXPIRES ?? "15m") as SignOptions["expiresIn"];;

const router = Router();

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
      return res.status(404).json({ error: 'User not found' })
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if ( !validPassword ) {
      return res.status(401).json({ error: 'Incorrect password for this user.'})
    } 

    // Genero JWT
    const token = jwt.sign(
      { userId: user.id_user },         // payload
      JWT_SECRET,                  // secret
      { expiresIn: JWT_EXPIRES }   // options (NOT the 2nd arg)
    )

    res.status(200).json({
      accessToken: token,
      expiresIn: JWT_EXPIRES, // minutes        
      user: { id: user.id_user, username: user.name }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error trying to log in', details: err });
  }
});


export default router;
