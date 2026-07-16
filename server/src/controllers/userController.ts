import { Request, Response } from 'express';
import { userService } from '../services/userService.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const userController = {
  async getById(req: Request, res: Response) {
    const id = req.params.id as string;
    const user = await userService.getUserById(id);
    res.json(user);
  },

  async update(req: Request, res: Response) {
    const id = req.params.id as string;
    const { name, description } = req.body;
    const userId = req.userId!;

    if (id !== userId) {
      return res.status(403).json({ error: 'Not authorized to edit this profile' });
    }

    const user = await userService.updateUser(id, { name, description });
    res.json(user);
  },

  async uploadAvatar(req: MulterRequest, res: Response) {
    const id = req.params.id as string;
    const userId = req.userId!;

    if (id !== userId) {
      return res.status(403).json({ error: 'Not authorized to edit this profile' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await userService.updateUser(id, { avatarUrl });
    res.json(user);
  },

  async deleteAvatar(req: Request, res: Response) {
    const { id } = req.params;
    const userId = req.userId!;

    if (id !== userId) {
      return res.status(403).json({ error: 'Not authorized to edit this profile' });
    }

    const user = await userService.getUserById(id);
    if (user.avatarUrl) {
      const filePath = path.join(__dirname, '../../public', user.avatarUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const updatedUser = await userService.updateUser(id, { avatarUrl: undefined });
    res.json(updatedUser);
  },
};
