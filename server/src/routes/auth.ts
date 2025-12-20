import { Router } from 'express';
import { pool } from '../utils/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = Router();
const JWT_SECRET = "your_jwt_secret"; // in production use .env

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users(name, email, password) VALUES($1,$2,$3) RETURNING id, name, email',
            [name, email, hashed]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err: any) {
        if (err.code === '23505') { // duplicate email
            return res.status(400).json({ success: false, message: "Email already exists" });
        }
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ success: false, message: "User not found" });

        const user = result.rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ success: false, message: "Invalid password" });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;
