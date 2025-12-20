import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../db';
import { hashPassword, comparePassword } from '../utils/password';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const hashed = await hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role`,
      [name, email, hashed]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    // 🔹 Check if email exists
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Email is not registered' });
    }

    const user = userResult.rows[0];

    // 🔹 Check if password matches
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    // 🔹 Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};
