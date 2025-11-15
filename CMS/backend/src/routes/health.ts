import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import sequelize from '../config/database';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

router.get('/db', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'DB unavailable' });
  }
});

router.get('/storage', async (_req, res) => {
  try {
    const dir = process.env.UPLOAD_PATH || path.resolve(__dirname, '../../storage/uploads');
    await fs.mkdir(dir, { recursive: true });
    await fs.access(dir);
    res.json({ ok: true, dir });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Storage not writable' });
  }
});

export default router;
