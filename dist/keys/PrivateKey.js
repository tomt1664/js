"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var futoin_hkdf_1 = __importDefault(require("futoin-hkdf"));
var secp256k1_1 = __importDefault(require("secp256k1"));
var utils_1 = require("../utils");
var PublicKey_1 = __importDefault(require("./PublicKey"));
var PrivateKey = /** @class */ (function () {
    function PrivateKey(secret) {
        this.secret = secret || utils_1.getValidSecret();
        if (!secp256k1_1.default.privateKeyVerify(this.secret)) {
            throw new Error("Invalid private key");
        }
        this.publicKey = new PublicKey_1.default(Buffer.from(secp256k1_1.default.publicKeyCreate(this.secret)));
    }
    PrivateKey.fromHex = function (hex) {
        return new PrivateKey(utils_1.decodeHex(hex));
    };
    PrivateKey.prototype.toHex = function () {
        return "0x" + this.secret.toString("hex");
    };
    PrivateKey.prototype.encapsulate = function (pub) {
        var master = Buffer.concat([
            this.publicKey.uncompressed,
            this.multiply(pub),
        ]);
        return futoin_hkdf_1.default(master, 32, {
            hash: "SHA-256",
        });
    };
    PrivateKey.prototype.multiply = function (pub) {
        return Buffer.from(secp256k1_1.default.publicKeyTweakMul(pub.compressed, this.secret, false));
    };
    PrivateKey.prototype.equals = function (other) {
        return this.secret.equals(other.secret);
    };
    return PrivateKey;
}());
exports.default = PrivateKey;
