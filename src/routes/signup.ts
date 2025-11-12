import { Router } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET env var');
}

const JWT_EXPIRES = (process.env.JWT_EXPIRES ?? "15m") as SignOptions["expiresIn"];;

const SALT_ROUNDS = 10;

const router = Router();

// POST /signup → log user in
router.post('/', async (req, res) => {
  
  const { emailAddress, username, password } = req.body;
  try {
    
    const normalisedEmail = emailAddress.toLowerCase();
    const userByName = await prisma.user.findFirst({
      where: {
          name: username
      },
    })

    const userByEmail = await prisma.user.findFirst({
      where: {
          email: normalisedEmail
      },
    })

    if ( !normalisedEmail.includes('@') || normalisedEmail.endsWith('@') ) {
      return res.status(404).json({ error: 'Email address is not valid' })
    }

    if ( username.length > 15 || username.length < 4 ) {
      return res.status(404).json({ error: 'Username length is invalid' })
    }

    if (userByEmail) {
      return res.status(404).json({ error: 'Email already registered' })
    }

    if (userByName) {
      return res.status(404).json({ error: 'Username already taken' })
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await prisma.user.create({
      data: {
        name: username,
        email: normalisedEmail,
        password: hashedPassword,
      },
    });
    
    // Genero JWT
    const token = jwt.sign(
      { userId: newUser.id_user },         // payload
      JWT_SECRET,                  // secret
      { expiresIn: JWT_EXPIRES }   // options (NOT the 2nd arg)
    )

    res.status(201).json({
      message: "User registered successfully",
      accessToken: token,
      expiresIn: JWT_EXPIRES, // minutes
      user: { id: newUser.id_user, username: newUser.name }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error trying to sign up', details: err });
  }
});


export default router;