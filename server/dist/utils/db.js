"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    user: 'postgres',
    host: '127.0.0.1',
    database: 'college_inventory',
    password: 'password',
    port: 5432
});
//# sourceMappingURL=db.js.map