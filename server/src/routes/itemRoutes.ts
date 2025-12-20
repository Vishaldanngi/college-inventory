import express from "express";
import { getAllItems, addItem, deleteItem } from "../controllers/itemController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";

const router = express.Router();

// ✅ Anyone logged in can view items
router.get("/", authMiddleware, getAllItems);

// ✅ Only admin can add items
router.post("/", authMiddleware, adminOnly, addItem);

// ✅ Only admin can delete items
router.delete("/:id", authMiddleware, adminOnly, deleteItem);

export default router;
