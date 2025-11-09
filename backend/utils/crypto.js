const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);
const algorithm = 'aes-256-gcm';
const ivLength = 16;
const salt = process.env.ENCRYPTION_SALT;
const password = process.env.ENCRYPTION_PASSWORD;

async function getKey() {
    return await scrypt(password, salt, 32); 
}

async function encrypt(text) {
    const key = await getKey();
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, encrypted]).toString('hex');
}

async function decrypt(encryptedHex) {
    const key = await getKey();
    const data = Buffer.from(encryptedHex, 'hex');

    const iv = data.slice(0, ivLength);
    const authTag = data.slice(ivLength, ivLength + 16);
    const encrypted = data.slice(ivLength + 16);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
}

module.exports = { encrypt, decrypt };