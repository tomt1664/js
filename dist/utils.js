"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aesDecrypt = exports.aesEncrypt = exports.getValidSecret = exports.decodeHex = exports.remove0x = void 0;
var crypto_1 = require("crypto");
var secp256k1_1 = __importDefault(require("secp256k1"));
function remove0x(hex) {
    if (hex.startsWith("0x") || hex.startsWith("0X")) {
        return hex.slice(2);
    }
    return hex;
}
exports.remove0x = remove0x;
function decodeHex(hex) {
    return Buffer.from(remove0x(hex), "hex");
}
exports.decodeHex = decodeHex;
function getValidSecret() {
    var key;
    do {
        key = crypto_1.randomBytes(32);
    } while (!secp256k1_1.default.privateKeyVerify(key));
    return key;
}
exports.getValidSecret = getValidSecret;
function aesEncrypt(key, plainText) {
    var nonce = crypto_1.randomBytes(12);
    var cipher = crypto_1.createCipheriv("aes-256-gcm", key, nonce);
    var encrypted = Buffer.concat([cipher.update(plainText), cipher.final()]);
    var tag = cipher.getAuthTag();
    return Buffer.concat([nonce, tag, encrypted]);
}
exports.aesEncrypt = aesEncrypt;
function aesDecrypt(key, cipherText) {
    var nonce = cipherText.slice(0, 12);
    var tag = cipherText.slice(12, 28);
    var ciphered = cipherText.slice(28);
    var decipher = crypto_1.createDecipheriv("aes-256-gcm", key, nonce);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(ciphered), decipher.final()]);
}
exports.aesDecrypt = aesDecrypt;
