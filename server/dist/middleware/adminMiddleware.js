"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = void 0;
const adminOnly = (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access only' });
    }
    next();
};
exports.adminOnly = adminOnly;
//# sourceMappingURL=adminMiddleware.js.map