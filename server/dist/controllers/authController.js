"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const password_1 = require("../utils/password");
const register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashed = await (0, password_1.hashPassword)(password);
        const result = await db_1.pool.query(`INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, role`, [name, email, hashed]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Registration failed' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await db_1.pool.query('SELECT * FROM users WHERE email=$1', [email]);
        // 🔹 Check if email exists
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Email is not registered' });
        }
        const user = userResult.rows[0];
        // 🔹 Check if password matches
        const match = await (0, password_1.comparePassword)(password, user.password);
        if (!match) {
            return res.status(400).json({ error: 'Password is incorrect' });
        }
        // 🔹 Generate JWT token
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map