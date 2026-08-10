import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import prisma from './lib/prisma';

import { toNodeHandler } from 'better-auth/node';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from './lib/auth';




const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // কুকি পাঠাতে/রিসিভ করতে জরুরি
}));

app.all('/api/auth/*path', toNodeHandler(auth));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Example route
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/api/profile', async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.json({ user: session.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});