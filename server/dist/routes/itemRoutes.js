"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const itemController_1 = require("../controllers/itemController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = express_1.default.Router();
// ✅ Anyone logged in can view items
router.get("/", authMiddleware_1.authMiddleware, itemController_1.getAllItems);
// ✅ Only admin can add items
router.post("/", authMiddleware_1.authMiddleware, adminMiddleware_1.adminOnly, itemController_1.addItem);
// ✅ Only admin can delete items
router.delete("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminOnly, itemController_1.deleteItem);
exports.default = router;
//# sourceMappingURL=itemRoutes.js.map