"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Provide sensible defaults to match backend config/database.ts
const pool = new pg_1.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'spa_cms_db',
    user: process.env.DB_USER || 'spa_cms_user',
    password: process.env.DB_PASSWORD || 'spa_cms_password',
});
async function runMigrations() {
    try {
        console.log('Starting migrations...');
        // Ensure pgcrypto extension exists for gen_random_uuid()
        console.log('Ensuring pgcrypto extension...');
        await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');
        // Discover and run all .sql migrations in this directory in lexical order
        const dir = __dirname;
        const files = fs
            .readdirSync(dir)
            .filter((f) => f.endsWith('.sql'))
            .sort();
        if (files.length === 0) {
            console.log('No SQL migration files found. Nothing to do.');
            return;
        }
        for (const file of files) {
            const sqlPath = path.join(dir, file);
            const sql = fs.readFileSync(sqlPath, 'utf8');
            console.log(`Running migration: ${file}`);
            await pool.query(sql);
            console.log(`Completed: ${file}`);
        }
        console.log('Migrations completed successfully!');
    }
    catch (error) {
        console.error('Error running migrations:', error);
        process.exit(1);
    }
    finally {
        await pool.end();
    }
}
runMigrations();
//# sourceMappingURL=run-migrations.js.map