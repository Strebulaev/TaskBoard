import { Request, Response, NextFunction } from 'express';

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' });
  }

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  next();
};
