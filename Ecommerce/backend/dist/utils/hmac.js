"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hmacSHA256Hex = hmacSHA256Hex;
const crypto_1 = __importDefault(require("crypto"));
/**
 * HMAC SHA256 Hex for ZaloPay
 * Used for creating order, querying order, and refund operations
 */
function hmacSHA256Hex(key, data) {
    return crypto_1.default.createHmac('sha256', key).update(data, 'utf8').digest('hex');
}
//# sourceMappingURL=hmac.js.map