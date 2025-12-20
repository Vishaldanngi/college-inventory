import { Request, Response } from 'express';
import { pool } from '../db';

// Get all items
export const getAllItems = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM items ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch items error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Add new item
export const addItem = async (req: Request, res: Response) => {
  const { name, category, quantity, item_condition, description } = req.body;

  if (!name || !category || quantity === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const parsedQuantity = Number(quantity);
  if (isNaN(parsedQuantity)) {
    return res.status(400).json({ error: 'Quantity must be a number' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO items 
       (name, category, quantity, item_condition, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, category, parsedQuantity, item_condition, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Add item error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};


export const deleteItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM items WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete item" });
  }
};