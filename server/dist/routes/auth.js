"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../utils/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const JWT_SECRET = "your_jwt_secret"; // in production use .env
// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashed = await bcrypt_1.default.hash(password, 10);
        const result = await db_1.pool.query('INSERT INTO users(name, email, password) VALUES($1,$2,$3) RETURNING id, name, email', [name, email, hashed]);
        res.json({ success: true, user: result.rows[0] });
    }
    catch (err) {
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
        const result = await db_1.pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (result.rows.length === 0)
            return res.status(400).json({ success: false, message: "User not found" });
        const user = result.rows[0];
        const match = await bcrypt_1.default.compare(password, user.password);
        if (!match)
            return res.status(400).json({ success: false, message: "Invalid password" });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map