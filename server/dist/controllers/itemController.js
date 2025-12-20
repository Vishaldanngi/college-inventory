"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = exports.addItem = exports.getAllItems = void 0;
const db_1 = require("../db");
// Get all items
const getAllItems = async (_req, res) => {
    try {
        const result = await db_1.pool.query('SELECT * FROM items ORDER BY id ASC');
        res.json(result.rows);
    }
    catch (err) {
        console.error('Fetch items error:', err);
        res.status(500).json({ error: 'Database error' });
    }
};
exports.getAllItems = getAllItems;
// Add new item
const addItem = async (req, res) => {
    const { name, category, quantity, item_condition, description } = req.body;
    if (!name || !category || quantity === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity)) {
        return res.status(400).json({ error: 'Quantity must be a number' });
    }
    try {
        const result = await db_1.pool.query(`INSERT INTO items 
       (name, category, quantity, item_condition, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, [name, category, parsedQuantity, item_condition, description]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error('Add item error:', err);
        res.status(500).json({ error: 'Database error' });
    }
};
exports.addItem = addItem;
const deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db_1.pool.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.json({ message: "Item deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete item" });
    }
};
exports.deleteItem = deleteItem;
//# sourceMappingURL=itemController.js.map