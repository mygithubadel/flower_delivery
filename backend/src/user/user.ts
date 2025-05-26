import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { authenticateJWT } from '../auth';
import { Request, Response, Router } from 'express';
import {loginSchema, registerSchema} from "./schema";
import {LoginRequestBody, RegisterRequestBody} from "./types";
import {getUser, registerUser} from "./service";

const router = Router();

// REGISTER
router.post('/register', async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    try {
        const userId = await registerUser(req.body)
        res.status(201).json({ message: 'User registered', userId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Username or email already exists' });
            return;
        }
        res.status(500).json({ error: 'Database error' });
    }
});

// LOGIN
router.post('/login', async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { error } = loginSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    const { username, password } = req.body;

    try {

        const user = await getUser(username);

        if (user === null) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// PROFILE
router.get('/profile', authenticateJWT, async (req: Request, res: Response) => {
  const tokenUser = (req as any).user;
  const dbUser = await getUser(tokenUser.username);
  const responseUser = {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      phone: dbUser.phone,
      invited_by: dbUser.invited_by || undefined
  };
  res.json(responseUser);
});

// INVITE
router.post('/invite', authenticateJWT, async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    const tokenUser = (req as any).user;
    const { error } = registerSchema.validate(req.body);
    if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    try {
        const userId = await registerUser(req.body, tokenUser.id)
        res.status(201).json({ message: 'User invited', userId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({ error: 'Username or email already exists' });
            return;
        }
        res.status(500).json({ error: 'Database error' });
    }
});


export default router;