"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var futoin_hkdf_1 = __importDefault(require("futoin-hkdf"));
var secp256k1_1 = __importDefault(require("secp256k1"));
var utils_1 = require("../utils");
var PublicKey = /** @class */ (function () {
    function PublicKey(buffer) {
        this.uncompressed = Buffer.from(secp256k1_1.default.publicKeyConvert(buffer, false));
        this.compressed = Buffer.from(secp256k1_1.default.publicKeyConvert(buffer, true));
    }
    PublicKey.fromHex = function (hex) {
        var decoded = utils_1.decodeHex(hex);
        if (decoded.length === 64) {
            // eth public key
            var prefix = Buffer.from([0x04]);
            var fixed = Buffer.concat([prefix, decoded]);
            return new PublicKey(fixed);
        }
        return new PublicKey(decoded);
    };
    PublicKey.prototype.toHex = function (compressed) {
        if (compressed === void 0) { compressed = true; }
        if (compressed) {
            return this.compressed.toString("hex");
        }
        else {
            return this.uncompressed.toString("hex");
        }
    };
    PublicKey.prototype.decapsulate = function (priv) {
        var master = Buffer.concat([
            this.uncompressed,
            priv.multiply(this),
        ]);
        return futoin_hkdf_1.default(master, 32, {
            hash: "SHA-256",
        });
    };
    PublicKey.prototype.equals = function (other) {
        return this.uncompressed.equals(other.uncompressed);
    };
    return PublicKey;
}());
exports.default = PublicKey;
