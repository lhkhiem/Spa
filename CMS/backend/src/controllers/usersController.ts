import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import User from '../models/User';

// List users (basic fields only)
export const listUsers = async (req: AuthRequest, res: Response) => {
  try {
    const where: any = {};
    const role = (req.query.role as string) || undefined;
    if (role) where.role = role;

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'status', 'role', 'created_at', 'updated_at'],
      order: [['created_at', 'DESC']],
    });
    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create a new user (owner only)
export const createUser = async (req: AuthRequest, res: Response) => {
  try {
    const actor = req.user as any;
    if (!actor || actor.role !== 'owner') {
      return res.status(403).json({ error: 'Insufficient permission' });
    }

    const { email, password, name, role } = req.body as {
      email: string; password: string; name: string; role?: string;
    };

    // Basic validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email unique
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Password policy: min 8, at least one letter and one number
    const pwdOk = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}\[\]:;"'`~<>,.?\/]{8,}$/.test(password);
    if (!pwdOk) {
      return res.status(400).json({ error: 'Password must be at least 8 characters and include letters and numbers' });
    }

    // Role: restrict to allowed set (cannot create another owner directly for safety)
    const allowedRoles = ['admin', 'editor', 'author'];
    const newRole = role && allowedRoles.includes(role) ? role : 'admin';

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, name, password_hash, role: newRole, status: 'active' });

    res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: (user as any).role,
      status: user.status,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};
